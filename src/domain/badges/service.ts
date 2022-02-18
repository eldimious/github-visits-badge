import { IRepositories } from '../../common/interfaces/IRepositories';
import { IServiceFactory } from '../../common/interfaces/IServiceFactory';
import { Transactional } from '../../data/infrastructure/db';
import { Project } from '../projects/model';
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
  init(repositories: IRepositories, inTransaction: any) {
    async function getRepoVisitsBadge(repoVisitsBadgeDto: IRepoVisitsBadgeDto): Promise<Badge> {
      const projectId = `${repoVisitsBadgeDto.user}/${repoVisitsBadgeDto.repository}`;
      const result: Project = await inTransaction(async (t: Transactional) => {
        const project = await repositories.projectsRepository.getProject({
          projectId,
          lock: t.LOCK.UPDATE,
          transaction: t,
        });
        if (!project) {
          return repositories.projectsRepository.createProject({
            projectId,
            lock: t.LOCK.UPDATE,
            transaction: t,
            ...repoVisitsBadgeDto,
          });
        }
        return repositories.projectsRepository.updateProject({
          projectId,
          lock: t.LOCK.UPDATE,
          transaction: t,
          ...repoVisitsBadgeDto,
        });
      });
      return repositories.badgesRepository.getVisitsBadgeUrl({
        badgeId: result.projectId,
        badge: result.counter,
      });
    }

    return {
      getRepoVisitsBadge,
    };
  },
};
