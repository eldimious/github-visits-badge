/* eslint-disable eqeqeq */
import { Sequelize } from 'sequelize-typescript';
import { IRepositoryFactory } from '../../../common/interfaces/IRepositoryFactory';
import { IUpdateOrCreateProjectDto } from '../../../domain/projects/IProjectsRepository';
import { Project } from '../../../domain/projects/model';
import { ProjectDao } from '../../infrastructure/db/schemas/Project';

interface IProjectsDataStore {
  updateOrCreateProject(updateOrCreateProjectDto: IUpdateOrCreateProjectDto): Promise<Project>
}

const projectsDataStore: IProjectsDataStore = {
  async updateOrCreateProject(updateOrCreateProjectDto: IUpdateOrCreateProjectDto): Promise<Project> {
    if (!updateOrCreateProjectDto.id && !updateOrCreateProjectDto.projectId) {
      throw new Error('Add id or or projectId to update project.');
    }
    const res = await ProjectDao.upsert({
      projectId: updateOrCreateProjectDto.projectId,
      user: updateOrCreateProjectDto.user,
      repository: updateOrCreateProjectDto.repository,
      counter: Sequelize.literal('"projects"."counter"+1'),
    }, {
      returning: true,
      validate: true,
      ...(updateOrCreateProjectDto.lock != null && { lock: updateOrCreateProjectDto.lock }),
      ...(updateOrCreateProjectDto.transaction != null && { transaction: updateOrCreateProjectDto.transaction }),
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

export const projectsDataStoreFactory: IRepositoryFactory<IProjectsDataStore> = {
  init(): IProjectsDataStore {
    return Object.create(projectsDataStore);
  },
};
