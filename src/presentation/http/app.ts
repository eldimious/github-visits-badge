import http from 'http';
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import bodyParser from 'body-parser';
import logger from 'morgan';
import helmet from 'helmet';
import path from 'path';
import { errorHandler } from '@dimosbotsaris/express-error-handler';
import { badgesRoutesFactory } from './routes/badges/routes';
import { IServices } from '../../common/interfaces/IServices';

const compress = compression();
const app = express();
app.disable('x-powered-by');
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '5mb' }));
app.use(compress);
app.use(logger('dev'));
app.use(cors());

export const appServerFactory = {
  init(services: IServices): http.Server {
    app.use(express.static(path.join(__dirname, 'public')));
    app.use('/badges', badgesRoutesFactory.init(services));
    app.get('/badges/health-check', async (req, res) => res.status(200).send('ok'));
    app.use(errorHandler({ trace: true }));
    return http.createServer(app);
  },
};
