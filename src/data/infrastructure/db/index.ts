import {
  Sequelize,
  SequelizeOptions,
} from 'sequelize-typescript';
import {
  Transaction,
  LOCK,
} from 'sequelize/types';
import { ProjectDao } from './schemas/Project';

const defaultOptions: SequelizeOptions = {
  dialect: 'postgres',
  logging: true,
  timezone: '+00:00',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  define: {
    freezeTableName: true,
  },
};

export class Database {
  private sequelize: Sequelize;

  runTransaction;

  constructor(dbConnectionString: string) {
    this.sequelize = new Sequelize(dbConnectionString, defaultOptions);
    this.sequelize.addModels([ProjectDao]);
    this.runTransaction = this.sequelize.transaction.bind(this.sequelize);
  }

  async connect(): Promise<void> {
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