import { Badge } from './model';

export interface IBadgesRepository{
  getVisitsUrl(badgeId: string, badge: number, color?: string): Badge
}
