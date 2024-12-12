export default {
  development: {
    username: 'postgres',
    password: 'postgres',
    database: 'tickets',
    host: 'localhost',
    dialect: 'postgres',
  },
  test: {
    username: 'postgres',
    password: 'postgres',
    database: 'tickets',
    host: 'localhost',
    dialect: 'postgres',
  },
  production: {
    username: process.env.DB_USERNAME,
    password: 'postgres',
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres',
  },
};
