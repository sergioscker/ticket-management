'use strict';
import { Model, DataTypes } from 'sequelize';

export default class Departments extends Model {
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
