'use strict';
import { Model, DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';
export default class Users extends Model {
  static associate(models) {
    // Um usuário pertence a um departamento
    this.belongsTo(models.Departments, {
      foreignKey: 'id_department',
      as: 'department',
    });
    // um usuário pode criar vários tickets
    this.hasMany(models.Tickets, {
      foreignKey: 'created_by',
      as: 'createdTickets',
    });
    // um usuário(admin) pode atualizar vários tickets
    this.hasMany(models.Tickets, {
      foreignKey: 'updated_by',
      as: 'updatedTickets',
    });
  }

  static initModel(sequelize) {
    return this.init(
      {
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        password: { type: DataTypes.VIRTUAL, allowNull: false },
        password_hash: { type: DataTypes.STRING, allowNull: false },
        admin: DataTypes.BOOLEAN,
      },
      {
        sequelize,
        modelName: 'Users',
      },
    );
  }
  static addHook() {
    this.addHook('beforeSave', async function (user) {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 10);
      }
    });
  }

  async comparePassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}
