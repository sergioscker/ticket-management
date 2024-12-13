'use strict';
const { Model, DataTypes } = require('sequelize');

class Departments extends Model {
  static associate(models) {
    this.hasMany(models.Tickets, {
      foreignKey: 'id_department',
      as: 'tickets',
    });
  }

  static initModel(sequelize) {
    return this.init(
      {
        title: DataTypes.STRING,
      },
      {
        sequelize,
        modelName: 'Departments',
      },
    );
  }
}

module.exports = Departments;
