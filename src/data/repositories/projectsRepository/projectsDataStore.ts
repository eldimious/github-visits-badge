/* eslint-disable eqeqeq */
import { Sequelize } from 'sequelize-typescript';
import { IRepositoryFactory } from '../../../common/interfaces/IRepositoryFactory';
import { IGetProjectDto, IUpdateProjectDto } from '../../../domain/projects/IProjectsRepository';
import { Project } from '../../../domain/projects/model';
import { ProjectDao } from '../../infrastructure/db/schemas/Project';

interface IProjectsDataStore {
  updateProject(updateOrCreateProjectDto: IUpdateProjectDto): Promise<Project>
  createProject(updateOrCreateProjectDto: IUpdateProjectDto): Promise<Project>
  getProject(projectQueryDto: IGetProjectDto): Promise<Project | undefined>
}

const projectsDataStore: IProjectsDataStore = {
  async getProject(projectQueryDto: IGetProjectDto): Promise<Project | undefined> {
    if (!projectQueryDto.id && !projectQueryDto.projectId) {
      throw new Error('Add projectId or id to get project.');
    }
    const res = await ProjectDao.findOne({
      where: {
        ...(projectQueryDto.id != null && { id: projectQueryDto.id }),
        ...(projectQueryDto.projectId != null && { projectId: projectQueryDto.projectId }),
      },
      ...(projectQueryDto.lock != null && { lock: projectQueryDto.lock }),
      ...(projectQueryDto.transaction != null && { transaction: projectQueryDto.transaction }),
    });
    return res?.toProject();
  },

  async createProject(updateOrCreateProjectDto: IUpdateProjectDto): Promise<Project> {
    const res = await ProjectDao.create({
      projectId: updateOrCreateProjectDto.projectId,
      user: updateOrCreateProjectDto.user,
      repository: updateOrCreateProjectDto.repository,
    }, {
      returning: true,
    });
    return res.toProject();
  },

  async updateProject(updateOrCreateProjectDto: IUpdateProjectDto): Promise<Project> {
    if (!updateOrCreateProjectDto.id && !updateOrCreateProjectDto.projectId) {
      throw new Error('Add id or or projectId to update project.');
    }
    const res = await ProjectDao.update({
      projectId: updateOrCreateProjectDto.projectId,
      counter: Sequelize.literal('"projects"."counter"+1'),
    }, {
      where: {
        projectId: updateOrCreateProjectDto.projectId,
      },
      returning: true,
      validate: true,
      ...(updateOrCreateProjectDto.lock != null && { lock: updateOrCreateProjectDto.lock }),
      ...(updateOrCreateProjectDto.transaction != null && { transaction: updateOrCreateProjectDto.transaction }),
    });
    console.log('xxxxx111', res[1][0])
    return res[1][0].toProject();
  },
};

export const projectsDataStoreFactory: IRepositoryFactory<IProjectsDataStore> = {
  init(): IProjectsDataStore {
    return Object.create(projectsDataStore);
  },
};
