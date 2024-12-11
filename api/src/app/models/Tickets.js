'use strict';
import { Model, DataTypes } from 'sequelize';

export default class Tickets extends Model {
  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'createdBy', as: 'user' });
    this.belongsTo(models.User, { foreignKey: 'assignedTo', as: 'assignee' });
  }

  static initModel(sequelize) {
    return this.init(
      {
        title: DataTypes.STRING,
        description: DataTypes.STRING,
        departament: DataTypes.STRING,
        status: {
          type: DataTypes.ENUM,
          values: ['Pending', 'Rejected', 'In Progress', 'Completed'],
          allowNull: false,
        },
        createdBy: {
          type: DataTypes.INTEGER,
          references: {
            model: 'Users',
            key: 'id',
          },
        },
        assignedTo: {
          type: DataTypes.INTEGER,
          references: {
            model: 'Users',
            key: 'id',
          },
        },
        observations: DataTypes.STRING,
      },

      {
        sequelize,
        modelName: 'Tickets',
      },
    );
  }
  static addHook() {
    this.addHook('beforeSave', function (ticket) {
      if (ticket.status === 'Rejected' && !ticket.observations) {
        throw new Error('Observations are required when rejecting a ticket.');
      }
    });
  }
}
