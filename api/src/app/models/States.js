'use strict';
import { Model, DataTypes } from 'sequelize';

export default class States extends Model {
  static associate(models) {
    this.hasMany(models.Ticket, { foreignKey: 'id_states' });
  }

  static initModel(sequelize) {
    return this.init(
      {
        title: DataTypes.STRING,
      },

      {
        sequelize,
        modelName: 'States',
      },
    );
  }
}
