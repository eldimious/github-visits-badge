import { IBadgesRepository } from '../../domain/badges/IBadgesRepository';
import { IProjectsRepository } from '../../domain/projects/IProjectsRepository';

export interface IRepositories {
  badgesRepository: IBadgesRepository,
  projectsRepository: IProjectsRepository,
}
