import dotenv from 'dotenv';
dotenv.config();

import { Sequelize } from 'sequelize';
import dbConfig from '../../config/config.js';

// Models
import Users from '../app/models/Users.js';
import Tickets from '../app/models/Tickets.js';
import Departments from '../app/models/Departments.js';
import States from '../app/models/States.js';

// Set the current environment (defaults to 'development')
const env = process.env.NODE_ENV || 'development';
const config = dbConfig[env];

// models list
const models = [Users, Tickets, Departments, States];

// Database connection
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    logging: false,
  },
);

// models connect
models.forEach((model) => model.initModel(sequelize));

// associates configs
models.forEach((model) => {
  if (model.associate) {
    model.associate(sequelize.models);
  }
});

export { sequelize };
export default sequelize.models;
