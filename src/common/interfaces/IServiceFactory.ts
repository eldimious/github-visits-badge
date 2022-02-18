import { IRepositories } from './IRepositories';

export interface IServiceFactory<T> {
  init(repositories: IRepositories, inTransaction: any): T;
}
