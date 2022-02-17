docker build . -t eldimious/github-visits-badge:latest
docker push eldimious/github-visits-badge:latest
cd ./devops/aws/ecs_fargate &&
terraform init
terraform apply
