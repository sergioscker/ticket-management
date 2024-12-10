import { Sequelize } from 'sequelize';
import databaseConfig from './config/config.json' assert { type: 'json' };
// Models
// import User from '../app/models/User.js';

import Tickets from '../app/models/Tickets.js';

// Database connection
const sequelize = new Sequelize(
  databaseConfig.development.database,
  databaseConfig.development.username,
  databaseConfig.development.password,

  {
    host: databaseConfig.development.host,
    dialect: databaseConfig.development.dialect,
  },
);

// model initialization
const models = [Tickets];

// models connect
models.forEach((model) => model.init(sequelize));

// associates configs
models.forEach((model) => {
  if (model.associate) {
    model.associate(sequelize.models);
  }
});

export default sequelize;
