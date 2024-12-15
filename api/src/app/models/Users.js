'use strict';
const { Model, Sequelize } = require('sequelize');
const bcrypt = require('bcrypt');

class Users extends Model {
  static associate(models) {
    // Um usuário pertence a um departamento
    this.belongsTo(models.Departments, {
      foreignKey: 'id_department',
      as: 'department',
    });
    // um usuário pode criar vários tickets
    this.hasMany(models.Tickets, {
      foreignKey: 'createdBy',
      as: 'createdTickets',
    });
    // um usuário(admin) pode atualizar vários tickets
    this.hasMany(models.Tickets, {
      foreignKey: 'updatedBy',
      as: 'updatedTickets',
    });
  }

  static initModel(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        admin: Sequelize.BOOLEAN,
      },
      {
        sequelize,
        modelName: 'Users',
      },
    );

    this.addHook('beforeSave', async (user) => {
      if (user.password) {
        user.password_hash = await bcrypt.hashSync(user.password, 10);
      }
    });
    return this;
  }
  async comparePassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

module.exports = Users;
