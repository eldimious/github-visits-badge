export class Badge {
  readonly badgeId: string;

  readonly iconUrl: string;

  constructor(badgeId: string, iconUrl: string) {
    this.badgeId = badgeId;
    this.iconUrl = iconUrl;
  }
}
