const { v4: uuidv4 } = require('uuid');
const Yup = require('yup');
const bcrypt = require('bcrypt');

// model
const Users = require('../models/Users.js');
const Departments = require('../models/Departments.js');

class UserController {
  async store(req, res) {
    // verify user admin
    const user = await Users.findByPk(req.userId);

    if (!user || !user.admin) {
      return res
        .status(403)
        .json({ error: 'You do not have permission to create users.' });
    }

    // input validations
    const schema = Yup.object({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
      departmentTitle: Yup.string().required(),
      admin: Yup.boolean(),
    });

    try {
      schema.validateSync(req.body, { abortEarly: false });
    } catch (err) {
      return res.status(400).json({ error: err.errors });
    }

    const { name, email, password, departmentTitle, admin } = req.body;

    // verify title department
    try {
      const department = await Departments.findOne({
        where: {
          title: departmentTitle,
        },
      });

      if (!department) {
        return res.status(400).json({ error: 'Make sure department selected' });
      }

      // verify if user exists
      const userExists = await Users.findOne({
        where: {
          email,
        },
      });

      if (userExists) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // create user
      const user = await Users.create({
        id: uuidv4(),
        name,
        email,
        password,
        id_department: department.id,
        admin,
      });

      return res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        id_department: department.id,
        department: department.title,
        admin: user.admin,
      });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ error: 'An error occurred while creating the user.' });
    }
  }

  async update(req, res) {
    const user = await Users.findByPk(req.userId);

    if (!user) {
      return res.status(400).json({ error: 'User not found.' });
    }

    const schema = Yup.object({
      name: Yup.string(),
      currentPassword: Yup.string().min(
        6,
        'Current password must be at least 6 characters',
      ),
      newPassword: Yup.string()
        .min(6, 'New password must be at least 6 characters')
        .test(
          'not-same-as-current',
          'New password cannot be the same as current password',
          function (value) {
            return !value || value !== this.parent.currentPassword;
          },
        ),
      department: Yup.string().uuid().nullable(),
    });

    try {
      await schema.validate(req.body, { abortEarly: false });
    } catch (err) {
      return res.status(400).json({ error: err.errors });
    }

    const { name, currentPassword, newPassword, department } = req.body;

    // Verificar se o departamento existe, se fornecido
    if (department) {
      const departmentExist = await Departments.findByPk(department.id);

      if (!departmentExist) {
        return res.status(400).json({ error: 'Department not found.' });
      }
    }

    // Atualizar apenas os campos modificados
    const updatedData = {};

    if (name) updatedData.name = name;
    if (department) updatedData.id_department = department;

    // Verificar se a senha atual coincide com a senha armazenada e atualizar a senha, se necessário
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          error: 'Current password is required to set a new password.',
        });
      }
      if (!(await bcrypt.compare(currentPassword, user.password_hash))) {
        return res
          .status(400)
          .json({ error: 'Current password is incorrect.' });
      }
      updatedData.password_hash = await bcrypt.hash(newPassword, 10);
    }

    await Users.update(updatedData, {
      where: { id: req.userId },
    });

    // Retornar os dados atualizados
    const updatedUser = await Users.findByPk(req.userId, {
      attributes: ['id', 'name', 'id_department'],
    });

    return res.status(200).json(updatedUser);
  }

  async index(req, res) {
    try {
      const user = await Users.findByPk(req.userId);

      if (!user || !user.admin) {
        return res
          .status(403)
          .json({ error: 'You dont have permission to update these fields.' });
      }

      const { page = 1, limit = 10 } = req.query;

      const { rows: users } = await Users.findAndCountAll({
        attributes: ['id', 'name', 'email', 'admin'],
        include: [
          { model: Departments, as: 'department', attributes: ['id', 'title'] },
        ],
        limit,
        offset: (page - 1) * limit,
      });

      return res.status(200).json(users);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ error: 'An error occurred while fetching users.' });
    }
  }

  async profile(req, res) {
    const user = await Users.findByPk(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      admin: user.admin,
    });
  }
}

module.exports = new UserController();
