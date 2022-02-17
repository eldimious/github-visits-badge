import { IBadgesRepository, IVisitsBadgeDto } from '../../../domain/badges/IBadgesRepository';
import { Badge } from '../../../domain/badges/model';

interface IBadgesRepositoryFactory {
  init(): IBadgesRepository;
}

const badgesRepository: IBadgesRepository = {
  getVisitsBadgeUrl(visitsBadgeDto: IVisitsBadgeDto): Badge {
    const {
      badge,
      badgeId,
      ...rest
    } = Object.assign(visitsBadgeDto, {
      color: 'green',
      style: 'flat',
      labelColor: 'gray',
    });
    Object.keys(rest)
      .reduce((accumulator: string, current: string, currentIndex: number) => `${accumulator}${current}=${rest[currentIndex]}&`, '?');
    return `https://img.shields.io/badge/Visits-${badge}-${rest.color}?style=${rest.style}`.toBadge(badgeId);
  },
};

export const badgesRepositoryFactory: IBadgesRepositoryFactory = {
  init(): IBadgesRepository {
    return Object.create(badgesRepository);
  },
};
