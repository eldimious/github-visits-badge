/* eslint-disable eqeqeq */
import { IRepositoryFactory } from '../../../common/interfaces/IRepositoryFactory';
import { ICreateProjectDto, IGetProjectDto, IProjectsRepository, IUpdateProjectDto } from '../../../domain/projects/IProjectsRepository';
import { Project } from '../../../domain/projects/model';
import { projectsDataStoreFactory } from './projectsDataStore';
import { projectsRemoteStoreFactory } from './projectsRemoteStore';

const projectsDataStore = projectsDataStoreFactory.init();
const projectsRemoteStore = projectsRemoteStoreFactory.init();

const projectsStore: IProjectsRepository = {
  async updateProject(updateProjectDto: IUpdateProjectDto): Promise<Project> {
    return projectsDataStore.updateProject(updateProjectDto);
  },

  async createProject(createProjectDto: ICreateProjectDto): Promise<Project> {
    await projectsRemoteStore.fetchProject(createProjectDto.user, createProjectDto.repository);
    return projectsDataStore.createProject(createProjectDto);
  },

  async getProject(projectQueryDto: IGetProjectDto): Promise<Project | undefined> {
    return projectsDataStore.getProject(projectQueryDto);
  },
};

export const projectsRepositoryFactory: IRepositoryFactory<IProjectsRepository> = {
  init(): IProjectsRepository {
    return Object.create(projectsStore);
  },
};
