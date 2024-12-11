'use strict';
import { Model, DataTypes } from 'sequelize';

export default class User extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // Define association here
  }

  static initModel(sequelize) {
    return this.init(
      {
        username: DataTypes.STRING,
        password: DataTypes.STRING,
        role: DataTypes.STRING,
      },
      {
        sequelize,
        modelName: 'User',
      },
    );
  }
}
