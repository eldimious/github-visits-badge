import { LockEnum, Transactional } from '../../data/infrastructure/db';
import { Project } from './model';

export interface IUpdateProjectWhere {
  id?: number,
  projectId?: string,
  transaction?: Transactional,
  lock?: LockEnum,
}

export interface IProjectsRepository{
  increaseProjectCounter(increaseCounterDto: IUpdateProjectWhere): Promise<Project>
}
