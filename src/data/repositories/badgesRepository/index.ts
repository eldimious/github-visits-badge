import { IBadgesRepository, IVisitsBadgeDto } from '../../../domain/badges/IBadgesRepository';
import { Badge } from '../../../domain/badges/model';
import '../../../common/utils/string';

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
    const queryParams = Object.keys(rest)
      .reduce((accumulator: string, current: string, currentIndex: number) => `${accumulator}${current}=${rest[currentIndex]}&`, '?');
    const iconUrl = `https://img.shields.io/badge/Visits-${badge}-${rest.color}${queryParams}`;
    return iconUrl.toBadge(badgeId);
  },
};

export const badgesRepositoryFactory: IBadgesRepositoryFactory = {
  init(): IBadgesRepository {
    return Object.create(badgesRepository);
  },
};
