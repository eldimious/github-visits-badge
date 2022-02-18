import { LockEnum, Transactional } from '../../data/infrastructure/db';
import { Project } from './model';

export interface ICreateProjectDto {
  projectId: string,
  user: string,
  repository: string,
  transaction?: Transactional,
  lock?: LockEnum,
}

export interface IUpdateProjectDto {
  id?: number,
  projectId?: string,
  user: string,
  repository: string,
  transaction?: Transactional,
  lock?: LockEnum,
}

export interface IGetProjectDto {
  id?: number,
  projectId?: string,
  transaction?: Transactional,
  lock?: LockEnum,
}

export interface IProjectsRepository {
  createProject(updateOrCreateProjectDto: IUpdateProjectDto): Promise<Project>
  updateProject(updateOrCreateProjectDto: IUpdateProjectDto): Promise<Project>
  getProject(projectQueryDto: IGetProjectDto): Promise<Project | undefined>
}
