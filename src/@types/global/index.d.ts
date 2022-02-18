import { Badge } from '../../domain/badges/model';

declare global {
  interface String {
    toBadge(badgeId: string): Badge;
  }
}
