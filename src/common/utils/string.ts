/* eslint-disable no-extend-native */
/* eslint-disable func-names */
import { Badge } from '../../domain/badges/model';

String.prototype.toBadge = function (badgeId: string): Badge {
  return new Badge(badgeId, String(this));
};
