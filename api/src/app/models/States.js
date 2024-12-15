'use strict';
const { Model, Sequelize } = require('sequelize');

class States extends Model {
  static associate(models) {
    this.hasMany(models.Tickets, { foreignKey: 'id_state', as: 'ticket' });
  }

  static initModel(sequelize) {
    return this.init(
      {
        title: Sequelize.STRING,
      },
      {
        sequelize,
        modelName: 'States',
        timestamps: true,
      },
    );
  }
}

module.exports = States;
