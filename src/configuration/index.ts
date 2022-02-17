import dotenv from 'dotenv';

dotenv.config();

export default {
  database: {
    connectionString: process.env.DATABASE_URL,
  },
  server: {
    httpPort: process.env.HTTP_PORT || 8080,
  },
  github: {
    id: process.env.GITHUB_ID,
    token: process.env.GITHUB_TOKEN,
  },
};
