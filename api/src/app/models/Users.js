'use strict';
import { Model, DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';

export default class Users extends Model {
  static initModel(sequelize) {
    return this.init(
      {
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        departament: DataTypes.STRING,
        password: { type: DataTypes.VIRTUAL, allowNull: false },
        password_hash: { type: DataTypes.STRING, allowNull: false },
        admin: DataTypes.BOOLEAN,
      },
      {
        sequelize,
        modelName: 'User',
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
