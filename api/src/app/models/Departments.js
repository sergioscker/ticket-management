'use strict';
const { Model, Sequelize } = require('sequelize');

class Departments extends Model {
  static associate(models) {
    // Um departamento pode ter vários Tickets
    this.hasMany(models.Tickets, {
      foreignKey: 'id_department',
      as: 'tickets',
    });
    // Um departamento pode ter vários usuários
    this.hasMany(models.Users, {
      foreignKey: 'id_department',
      as: 'users',
    });
  }

  static initModel(sequelize) {
    return this.init(
      {
        title: Sequelize.STRING,
      },
      {
        sequelize,
        modelName: 'Departments',
        timestamps: true,
      },
    );
  }
}

module.exports = Departments;
