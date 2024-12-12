'use strict';
import { Model, DataTypes } from 'sequelize';

export default class Department extends Model {
  static associate(models) {
    this.hasMany(models.Ticket, { foreignKey: 'id_state' });
  }

  static initModel(sequelize) {
    return this.init(
      {
        title: DataTypes.STRING,
      },

      {
        sequelize,
        modelName: 'Departaments',
      },
    );
  }
}
