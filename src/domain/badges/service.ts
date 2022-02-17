import { IRepositories } from '../../common/interfaces/IRepositories';
import { IServiceFactory } from '../../common/interfaces/IServiceFactory';
import { Badge } from './model';

export interface IRepoVisitsBadgeDto {
  user: string,
  repository: string,
  color?: string,
  style?: string,
  logo?: string,
  labelColor?: string,
  label?: string
}

export interface IBadgesService {
  getRepoVisitsBadge(repoVisitsBadgeDto: IRepoVisitsBadgeDto): Promise<Badge>
}

export const badgesServiceFactory: IServiceFactory<IBadgesService> = {
  init(repositories: IRepositories) {
    async function getRepoVisitsBadge(repoVisitsBadgeDto: IRepoVisitsBadgeDto): Promise<Badge> {
      const project = await repositories.projectsRepository.updateOrCreateProject(repoVisitsBadgeDto);
      return repositories.badgesRepository.getVisitsBadgeUrl({
        badgeId: project.projectId,
        badge: project.counter,
      });
    }

    return {
      getRepoVisitsBadge,
    };
  },
};
