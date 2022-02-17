import { Router } from 'express';
import { IServices } from './IServices';

export interface IRouteFactory {
  init(services: IServices): Router;
}
