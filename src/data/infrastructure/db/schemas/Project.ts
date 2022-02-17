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

export interface IProject {
  id?: number;
  projectId: string;
  counter: number;
  user: string;
  repository: string;
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

  @AllowNull(false)
  @NotEmpty
  @Column(DataType.STRING)
    user!: string;

  @AllowNull(false)
  @NotEmpty
  @Column(DataType.STRING)
    repository!: string;

  @CreatedAt
    createdAt!: Date;

  @UpdatedAt
    updatedAt!: Date;

  toProject(): Project {
    return new Project(this.id, this.projectId, this.counter, this.user, this.repository, this.createdAt, this.updatedAt);
  }
}
