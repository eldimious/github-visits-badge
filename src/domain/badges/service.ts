import { IRepositories } from '../../common/interfaces/IRepositories';
import { IServiceFactory } from '../../common/interfaces/IServiceFactory';
import { Badge } from './model';

export interface IBadgesService {
  getRepoVisitsBadge(user: string, repository: string): Promise<Badge>
}

export const badgesServiceFactory: IServiceFactory<IBadgesService> = {
  init(repositories: IRepositories) {
    async function getRepoVisitsBadge(user: string, repository: string): Promise<Badge> {
      const project = await repositories.projectsRepository.updateOrCreateProject({
        user,
        repository,
      });
      return repositories.badgesRepository.getVisitsUrl(project.projectId, project.counter);
    }

    return {
      getRepoVisitsBadge,
    };
  },
};
