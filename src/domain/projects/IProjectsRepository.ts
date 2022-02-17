import { LockEnum, Transactional } from '../../data/infrastructure/db';
import { Project } from './model';

export interface IUpdateOrCreateProjectDto {
  id?: number,
  projectId?: string,
  user: string,
  repository: string,
  transaction?: Transactional,
  lock?: LockEnum,
}

export interface IProjectsRepository{
  updateOrCreateProject(updateOrCreateProjectDto: IUpdateOrCreateProjectDto): Promise<Project>
}
