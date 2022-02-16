import { IBadgesRepository } from '../../../domain/badges/IBadgesRepository';

interface IBadgesRepositoryFactory {
  init(): IBadgesRepository;
}

const badgesRepository: IBadgesRepository = {
  getVisitsUrl(badge: number, color: string = 'green'): string {
    return `https://img.shields.io/badge/Visits-${badge}-${color}`;
  },
};

export const badgesRepositoryFactory: IBadgesRepositoryFactory = {
  init(): IBadgesRepository {
    return Object.create(badgesRepository);
  },
};
