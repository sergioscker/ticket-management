'use strict';
const { Model, DataTypes } = require('sequelize');

class States extends Model {
  static associate(models) {
    this.hasMany(models.Tickets, { foreignKey: 'id_state' });
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

module.exports = States;
