import { IBadgesRepository } from '../../../domain/badges/IBadgesRepository';
import { Badge } from '../../../domain/badges/model';

interface IBadgesRepositoryFactory {
  init(): IBadgesRepository;
}

const badgesRepository: IBadgesRepository = {
  getVisitsUrl(badgeId: string, badge: number, color: string = 'green'): Badge {
    return `https://img.shields.io/badge/Visits-${badge}-${color}`.toBadge(badgeId);
  },
};

export const badgesRepositoryFactory: IBadgesRepositoryFactory = {
  init(): IBadgesRepository {
    return Object.create(badgesRepository);
  },
};
