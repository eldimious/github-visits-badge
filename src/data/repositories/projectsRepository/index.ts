/* eslint-disable eqeqeq */
import { Sequelize } from 'sequelize-typescript';
import { IProjectsRepository, IUpdateProjectWhere } from '../../../domain/projects/IProjectsRepository';
import { Project } from '../../../domain/projects/model';
import { ProjectDao } from '../../infrastructure/db/schemas/Project';

interface IProjectsRepositoryFactory {
  init(): IProjectsRepository;
}

const projectsStore: IProjectsRepository = {
  async increaseProjectCounter(increaseCounterDto: IUpdateProjectWhere): Promise<Project> {
    if (!increaseCounterDto.id && !increaseCounterDto.projectId) {
      throw new Error('Add id or or projectId to update project.');
    }
    const res = await ProjectDao.update({
      logDaysCounter: Sequelize.literal('"metrics"."logDaysCounter"+1'),
    }, {
      where: {
        ...(increaseCounterDto.id && { id: increaseCounterDto.id }),
        ...(increaseCounterDto.projectId && { projectId: increaseCounterDto.projectId }),
      },
      returning: true,
      limit: 1,
      ...(increaseCounterDto.lock != null && { lock: increaseCounterDto.lock }),
      ...(increaseCounterDto.transaction != null && { transaction: increaseCounterDto.transaction }),
    });
    if (!res || res == 0) {
      throw new Error('The project did not find.');
    }
    if (!Array.isArray(res) || res.length < 2 || !Array.isArray(res[1]) || res[1].length <= 0) {
      throw new Error('The project did not find.');
    }
    return res[1][0].toProject();
  },
};

export const projectsRepositoryFactory: IProjectsRepositoryFactory = {
  init(): IProjectsRepository {
    return Object.create(projectsStore);
  },
};
