provider "aws" {
  shared_credentials_file = "$HOME/.aws/credentials"
  profile                 = "default"
  region                  = var.aws_region
}

module "networking" {
  source               = "../common/modules/network"
  create_vpc           = var.create_vpc
  create_igw           = var.create_igw
  single_nat_gateway   = var.single_nat_gateway
  enable_nat_gateway   = var.enable_nat_gateway
  region               = var.aws_region
  vpc_name             = var.vpc_name
  cidr_block           = var.cidr_block
  availability_zones   = var.availability_zones
  public_subnet_cidrs  = var.public_subnet_cidrs
  private_subnet_cidrs = var.private_subnet_cidrs
}

################################################################################
# ECS Tasks Execution IAM
################################################################################
# ECS task execution role data
data "aws_iam_policy_document" "ecs_task_execution_role" {
  version = "2012-10-17"
  statement {
    sid     = ""
    effect  = "Allow"
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

# ECS task execution role
resource "aws_iam_role" "ecs_task_execution_role" {
  name               = var.ecs_task_execution_role_name
  assume_role_policy = data.aws_iam_policy_document.ecs_task_execution_role.json
}

# ECS task execution role policy attachment
resource "aws_iam_role_policy_attachment" "ecs_task_execution_role" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

################################################################################
# VPC Flow Logs IAM
################################################################################
resource "aws_iam_role" "vpc_flow_cloudwatch_logs_role" {
  name               = "vpc-flow-cloudwatch-logs-role"
  assume_role_policy = file("../common/templates/policies/vpc_flow_cloudwatch_logs_role.json.tpl")
}

resource "aws_iam_role_policy" "vpc_flow_cloudwatch_logs_policy" {
  name   = "vpc-flow-cloudwatch-logs-policy"
  role   = aws_iam_role.vpc_flow_cloudwatch_logs_role.id
  policy = file("../common/templates/policies/vpc_flow_cloudwatch_logs_policy.json.tpl")
}

# VPC Flows
################################################################################
# Provides a VPC/Subnet/ENI Flow Log to capture IP traffic for a specific network interface, 
# subnet, or VPC. Logs are sent to a CloudWatch Log Group or a S3 Bucket.
# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/flow_log
resource "aws_flow_log" "vpc_flow_logs" {
  iam_role_arn    = aws_iam_role.vpc_flow_cloudwatch_logs_role.arn
  log_destination = aws_cloudwatch_log_group.vpc_flow_logs.arn
  traffic_type    = "ALL"
  vpc_id          = module.networking.vpc_id
}

resource "aws_cloudwatch_log_group" "vpc_flow_logs" {
  name              = "vpc-flow-logs"
  retention_in_days = 30
}

module "alb_sg" {
  source                   = "../common/modules/security"
  create_vpc               = var.create_vpc
  create_sg                = true
  sg_name                  = "load-balancer-security-group"
  description              = "controls access to the ALB"
  rule_ingress_description = "controls access to the ALB"
  rule_egress_description  = "allow all outbound"
  vpc_id                   = module.networking.vpc_id
  ingress_cidr_blocks      = ["0.0.0.0/0"]
  ingress_from_port        = 80
  ingress_to_port          = 80
  ingress_protocol         = "tcp"
  egress_cidr_blocks       = ["0.0.0.0/0"]
  egress_from_port         = 0
  egress_to_port           = 0
  egress_protocol          = "-1"
}

module "ecs_tasks_sg" {
  source                           = "../common/modules/security"
  create_vpc                       = var.create_vpc
  create_sg                        = true
  sg_name                          = "ecs-tasks-security-group"
  description                      = "controls access to the ECS tasks"
  rule_ingress_description         = "allow inbound access from the ALB only"
  rule_egress_description          = "allow all outbound"
  vpc_id                           = module.networking.vpc_id
  ingress_cidr_blocks              = null
  ingress_from_port                = 0
  ingress_to_port                  = 0
  ingress_protocol                 = "-1"
  ingress_source_security_group_id = module.alb_sg.security_group_id
  egress_cidr_blocks               = ["0.0.0.0/0"]
  egress_from_port                 = 0
  egress_to_port                   = 0
  egress_protocol                  = "-1"
}

module "private_ecs_tasks_sg" {
  source                   = "../common/modules/security"
  create_vpc               = var.create_vpc
  create_sg                = true
  sg_name                  = "ecs-private-tasks-security-group"
  description              = "controls access to the private ECS tasks (not internet facing)"
  rule_ingress_description = "allow inbound access only from resources in VPC"
  rule_egress_description  = "allow all outbound"
  vpc_id                   = module.networking.vpc_id
  ingress_cidr_blocks      = [var.cidr_block]
  ingress_from_port        = 0
  ingress_to_port          = 0
  ingress_protocol         = "-1"
  egress_cidr_blocks       = ["0.0.0.0/0"]
  egress_from_port         = 0
  egress_to_port           = 0
  egress_protocol          = "-1"
}

module "private_database_sg" {
  source                   = "../common/modules/security"
  create_vpc               = var.create_vpc
  create_sg                = true
  sg_name                  = "private-database-security-group"
  description              = "Controls access to the private lambdas (not internet facing)"
  rule_ingress_description = "allow inbound access only from resources in VPC"
  rule_egress_description  = "allow all outbound"
  vpc_id                   = module.networking.vpc_id
  ingress_cidr_blocks      = [var.cidr_block]
  ingress_from_port        = 0
  ingress_to_port          = 0
  ingress_protocol         = "-1"
  egress_cidr_blocks       = ["0.0.0.0/0"]
  egress_from_port         = 0
  egress_to_port           = 0
  egress_protocol          = "-1"
}

module "public_alb" {
  source             = "../common/modules/alb"
  create_alb         = var.create_alb
  load_balancer_type = "application"
  alb_name           = "main-ecs-lb"
  internal           = false
  vpc_id             = module.networking.vpc_id
  security_groups    = [module.alb_sg.security_group_id]
  subnet_ids         = module.networking.public_subnet_ids
  http_tcp_listeners = [
    {
      port        = 80
      protocol    = "HTTP"
      action_type = "fixed-response"
      fixed_response = {
        content_type = "text/plain"
        message_body = "Resource not found"
        status_code  = "404"
      }
    }
  ]
}

module "ecs_cluster" {
  source                   = "../common/modules/ecs_cluster"
  project                  = var.project
  create_capacity_provider = false
}

resource "aws_service_discovery_private_dns_namespace" "segment" {
  name        = "discovery.com"
  description = "Service discovery for backends"
  vpc         = module.networking.vpc_id
}

################################################################################
# Database Configuration
################################################################################
module "badges_database" {
  source                = "../common/modules/database"
  database_identifier   = "badges-database"
  database_username     = var.badges_database_username
  database_password     = var.badges_database_password
  subnet_ids            = module.networking.private_subnet_ids
  security_group_ids    = [module.private_database_sg.security_group_id]
  monitoring_role_name  = "BadgesDatabaseMonitoringRole"
}

################################################################################
# BADGES API ECS Service
################################################################################
module "ecs_badges_api_fargate" {
  source                                  = "../common/modules/ecs"
  aws_region                              = var.aws_region
  vpc_id                                  = module.networking.vpc_id
  cluster_id                              = module.ecs_cluster.cluster_id
  cluster_name                            = module.ecs_cluster.cluster_name
  has_discovery                           = true
  dns_namespace_id                        = aws_service_discovery_private_dns_namespace.segment.id
  service_security_groups_ids             = [module.ecs_tasks_sg.security_group_id]
  subnet_ids                              = module.networking.private_subnet_ids
  assign_public_ip                        = false
  iam_role_ecs_task_execution_role        = aws_iam_role.ecs_task_execution_role
  iam_role_policy_ecs_task_execution_role = aws_iam_role_policy_attachment.ecs_task_execution_role
  logs_retention_in_days                  = 30
  fargate_cpu                             = var.fargate_cpu
  fargate_memory                          = var.fargate_memory
  health_check_grace_period_seconds       = var.health_check_grace_period_seconds
  service_name                            = var.badges_api_name
  service_image                           = var.badges_api_image
  service_aws_logs_group                  = var.badges_api_aws_logs_group
  service_port                            = var.badges_api_port
  service_desired_count                   = var.badges_api_desired_count
  service_max_count                       = var.badges_api_max_count
  service_task_family                     = var.badges_api_task_family
  service_enviroment_variables = [
    {
      "name" : "POSTGRES_USER",
      "value" : module.private_database_sg.db_instance_username,
    },
    {
      "name" : "POSTGRES_PASSWORD",
      "value" : module.private_database_sg.db_master_password,
    },
    {
      "name" : "POSTGRES_HOST",
      "value" : module.private_database_sg.db_instance_address,
    },
    {
      "name" : "POSTGRES_DB",
      "value" : module.private_database_sg.db_instance_name,
    },
    {
      "name" : "POSTGRES_PORT",
      "value" : module.private_database_sg.db_instance_port,
    },
    {
      "name" : "GITHUB_ID",
      "value" : var.github_id,
    },
    {
      "name" : "GITHUB_TOKEN",
      "value" : var.github_token,
    }
  ]
  service_health_check_path               = var.badges_api_health_check_path
  network_mode                            = var.badges_api_network_mode
  task_compatibilities                    = var.badges_api_task_compatibilities
  launch_type                             = var.badges_api_launch_type
  alb_listener                            = module.public_alb.alb_listener
  has_alb                                 = true
  alb_listener_tg                         = var.badges_api_tg
  alb_listener_port                       = 80
  alb_listener_protocol                   = "HTTP"
  alb_listener_target_type                = "ip"
  alb_listener_arn                        = module.public_alb.alb_listener_http_tcp_arn
  alb_listener_rule_priority              = 2
  alb_listener_rule_type                  = "forward"
  alb_service_tg_paths                    = var.badges_api_tg_paths
  enable_autoscaling                      = true
  autoscaling_name                        = "${var.badges_api_name}_scaling"
  autoscaling_settings = {
    max_capacity       = 4
    min_capacity       = 2
    target_cpu_value   = 60
    scale_in_cooldown  = 60
    scale_out_cooldown = 900
  }
}
