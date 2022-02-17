import { Badge } from './model';

export interface IVisitsBadgeDto {
  badgeId: string,
  badge: number,
  color?: string,
  style?: string,
  logo?: string,
  labelColor?: string,
  label?: string
}

export interface IBadgesRepository{
  getVisitsBadgeUrl(visitsBadgeDto: IVisitsBadgeDto): Badge
}
