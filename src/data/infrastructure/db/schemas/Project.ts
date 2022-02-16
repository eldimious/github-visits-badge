/* eslint-disable new-cap */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/space-before-function-paren */
import {
  Table,
  Column,
  DataType,
  PrimaryKey,
  Unique,
  AllowNull,
  NotEmpty,
  AutoIncrement,
  CreatedAt,
  UpdatedAt,
  Model,
} from 'sequelize-typescript';
import { Project } from '../../../../domain/projects/model';

// export class Project extends Model<InferAttributes<Project>, InferCreationAttributes<Project>> {
//   declare id: CreationOptional<number>;

//   declare projectId: string;

//   declare counter: number;

//   declare createdAt: CreationOptional<Date>;

//   declare updatedAt: CreationOptional<Date>;
// }

// export default function(sequelize: Sequelize): typeof Project {
//   const product = Project.init(
//     {
//       id: {
//         type: DataTypes.INTEGER.UNSIGNED,
//         autoIncrement: true,
//         primaryKey: true,
//       },
//       projectId: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         unique: true,
//       },
//       counter: {
//         type: DataTypes.NUMBER,
//         allowNull: false,
//       },
//       createdAt: DataTypes.DATE,
//       updatedAt: DataTypes.DATE,
//     },
//     {
//       sequelize,
//       tableName: 'projects',
//       freezeTableName: true,
//     },
//   );

//   return product;
// }

export interface IProject {
  id?: number;
  projectId: string;
  counter: number;
  createdAt?: Date;
  updatedAt?: Date;
}

@Table({
  timestamps: true,
})
export class ProjectDao extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
    id!: number;

  @AllowNull(false)
  @NotEmpty
  @Unique
  @Column(DataType.STRING)
    projectId!: string;

  @AllowNull(false)
  @NotEmpty
  @Column(DataType.NUMBER)
    counter!: number;

  @CreatedAt
    createdAt!: Date;

  @UpdatedAt
    updatedAt!: Date;

  toProject(): Project {
    return new Project(this.id, this.projectId, this.counter, this.createdAt, this.updatedAt);
  }
}
