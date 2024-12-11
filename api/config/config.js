export default {
  development: {
    username: 'postgres',
    password: 'postgres',
    database: 'tickets',
    host: '127.0.0.1',
    dialect: 'postgres',
    migrations: './src/database/migrations',
  },
  test: {
    username: 'postgres',
    password: 'postgres',
    database: 'tickets',
    host: '127.0.0.1',
    dialect: 'postgres',
  },
  production: {
    username: 'postgres',
    password: 'postgres',
    database: 'database_production',
    host: '127.0.0.1',
    dialect: 'postgres',
  },
};
