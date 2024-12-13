const dotenv = require('dotenv');
dotenv.config();

const { Sequelize } = require('sequelize');
const dbConfig = require('../../config/config.js');

// Models
const Users = require('../app/models/Users.js');
const Tickets = require('../app/models/Tickets.js');
const Departments = require('../app/models/Departments.js');
const States = require('../app/models/States.js');

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

// Exporting sequelize and models
module.exports = {
  sequelize,
  models: sequelize.models,
};
