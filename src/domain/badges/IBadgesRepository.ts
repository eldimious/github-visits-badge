export interface IBadgesRepository{
  getVisitsUrl(badge: number, color: string): string
}