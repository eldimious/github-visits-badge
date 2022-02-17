import {
  Sequelize,
  SequelizeOptions,
} from 'sequelize-typescript';
import {
  Transaction,
  LOCK,
} from 'sequelize/types';
import { ProjectDao } from './schemas/Project';
import {
  PRODUCTION_ENV,
} from '../../../common/constants';

const defaultOptions: SequelizeOptions = {
  dialect: 'postgres',
  logging: true,
  timezone: '+00:00',
  dialectOptions: process.env.NODE_ENV === PRODUCTION_ENV
    ? {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    }
    : undefined,
  define: {
    freezeTableName: true,
  },
};

export class Database {
  private sequelize: Sequelize;

  // runTransaction;

  constructor(dbConnectionString: string) {
    console.log('dbConnectionString', dbConnectionString)
    this.sequelize = new Sequelize(dbConnectionString, defaultOptions);
    console.log('this.sequelize', this.sequelize)
    this.sequelize.addModels([ProjectDao]);
    console.log('this.sequelize11', this.sequelize)
    // this.runTransaction = this.sequelize.transaction.bind(this.sequelize);
  }

  async connect(): Promise<void> {
    console.log('this.sequelize11111', this.sequelize)
    await this.sequelize.authenticate();
  }

  async close(): Promise<any> {
    await this.sequelize.close();
    return this.sequelize.connectionManager.close();
  }

  sync(force: boolean = false, alter: boolean = false) {
    this.sequelize.sync({
      force,
      alter,
    });
  }
}

export type Transactional = Transaction;
export type LockEnum = LOCK;
