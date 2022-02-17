/* eslint-disable eqeqeq */
import { IRepositoryFactory } from '../../../common/interfaces/IRepositoryFactory';
import { IProjectsRepository, IUpdateOrCreateProjectDto } from '../../../domain/projects/IProjectsRepository';
import { Project } from '../../../domain/projects/model';
import { projectsDataStoreFactory } from './projectsDataStore';
import { projectsRemoteStoreFactory } from './projectsRemoteStore';

const projectsDataStore = projectsDataStoreFactory.init();
const projectsRemoteStore = projectsRemoteStoreFactory.init();

const projectsStore: IProjectsRepository = {
  async updateOrCreateProject(updateOrCreateProjectDto: IUpdateOrCreateProjectDto): Promise<Project> {
    const repo = await projectsRemoteStore.fetchProject(updateOrCreateProjectDto.user, updateOrCreateProjectDto.repository);
    return projectsDataStore.updateOrCreateProject({
      projectId: repo.fullName,
      user: repo.ownerName,
      repository: repo.projectName,
    });
  },
};

export const projectsRepositoryFactory: IRepositoryFactory<IProjectsRepository> = {
  init(): IProjectsRepository {
    return Object.create(projectsStore);
  },
};
