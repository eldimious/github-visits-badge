import config from './configuration';
import logging from './common/logging';
import { Database } from './data/infrastructure/db';
import { projectsRepositoryFactory } from './data/repositories/projectsRepository';
import { badgesRepositoryFactory } from './data/repositories/badgesRepository';
import { badgesServiceFactory } from './domain/badges/service';
import { appServerFactory } from './presentation/http/app';
import { IRepositories } from './common/interfaces/IRepositories';
import { IServices } from './common/interfaces/IServices';

const db = new Database(config.database.connectionString as string);
const projectsRepository = projectsRepositoryFactory.init();
const badgesRepository = badgesRepositoryFactory.init();
const badgesService = badgesServiceFactory.init({
  projectsRepository,
  badgesRepository,
} as IRepositories);
const app = appServerFactory.init({
  badgesService,
} as IServices);

(async () => {
  try {
    await db.connect();
    db.sync();
    app.listen(config.server.httpPort, () => {
      logging.info(`Listening on *:${config.server.httpPort}`);
    });
  } catch (error) {
    await db.close();
  }
})();
