'use strict';
const { Model, DataTypes } = require('sequelize');

class Tickets extends Model {
  static associate(models) {
    this.belongsTo(models.Users, { foreignKey: 'createdBy', as: 'creator' });
    this.belongsTo(models.Users, { foreignKey: 'updatedBy', as: 'updator' });
    this.belongsTo(models.States, { foreignKey: 'id_state', as: 'state' });
    this.belongsTo(models.Departments, {
      foreignKey: 'id_department',
      as: 'department',
    });
  }

  static initModel(sequelize) {
    return this.init(
      {
        title: DataTypes.STRING,
        description: DataTypes.STRING,
        observations: DataTypes.TEXT,
      },
      {
        sequelize,
        modelName: 'Tickets',
      },
    );
  }

  static addHook() {
    this.addHook('beforeUpdate', function (ticket) {
      if (ticket.status === 'Rejected' && (!ticket.observations || '')) {
        throw new Error('Observations are required when rejecting a ticket.');
      }
    });
  }
}

module.exports = Tickets;
