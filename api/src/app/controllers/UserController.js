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

    // input validation
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
        .json({ error: 'An error ocurred while creating user.' });
    }
  }

  async update(req, res) {
    const user = await Users.findByPk(req.userId);

    if (!user) {
      return res.status(400).json({ error: 'Make sure your user exists' });
    }

    const schema = Yup.object({
      name: Yup.string(),
      password: Yup.string().min(6),
      department: Yup.string(),
    });

    try {
      schema.validateSync(req.body, { abortEarly: false });
    } catch (err) {
      return res.status(400).json({ error: err.errors });
    }

    const { name, password, department } = req.body;

    // Verificar se o departamento enviado é o mesmo já cadastrado no usuário
    if (department && department === user.department) {
      return res.status(400).json({
        error: 'The selected department is already registered for this user.',
      });
    }

    const departmentExist = await Departments.findByPk(department);

    if (!departmentExist) {
      return res.status(400).json({
        error: 'The selected department does not exist.',
      });
    }

    // Verifique se a senha foi enviada
    let hashedPassword = user.password; // senha atual do user

    if (password) {
      // Criptografar a nova senha
      hashedPassword = await bcrypt.hash(password, 10);
    }

    await Users.update(
      {
        name,
        password: hashedPassword,
        department,
      },
      {
        where: { id: req.userId },
      },
    );

    return res.status(200).json();
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
}

module.exports = new UserController();
