import dotenv from 'dotenv';

dotenv.config();

export default {
  database: {
    connectionString: `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST || 'localhost'}:${process.env.POSTGRES_PORT || 5432}/${process.env.POSTGRES_DB}`,
  },
  server: {
    httpPort: process.env.HTTP_PORT || 8080,
  },
  github: {
    id: process.env.GITHUB_ID,
    token: process.env.GITHUB_TOKEN,
  },
};
