/* eslint-disable func-names */
/* eslint-disable no-extend-native */
import { Badge } from '../../domain/badges/model';

String.prototype.toBadge = function (badgeId: string): Badge {
  return new Badge(badgeId, String(this));
};
