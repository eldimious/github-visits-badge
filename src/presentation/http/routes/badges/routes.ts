import express, { Request, Response, Router } from 'express';
import { asyncWrapper } from '@dimosbotsaris/express-async-handler';
import { IServices } from '../../../../common/interfaces/IServices';
import { IRouteFactory } from '../../../../common/interfaces/IRouteFactory';

// eslint-disable-next-line new-cap
const router = express.Router({ mergeParams: true });

export const badgesRoutesFactory: IRouteFactory = {
  init(services: IServices): Router {
    router.get(
      '/visits/:user/:repo',
      asyncWrapper(async (req: Request, res: Response) => {
        const badge = await services.badgesService.getRepoVisitsBadge(req.params.user, req.params.repo);
        return res.redirect(badge.iconUrl);
      }),
    );

    return router;
  },
};
