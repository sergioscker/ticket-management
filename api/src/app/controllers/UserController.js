const { v4: uuidv4 } = require('uuid');
const Yup = require('yup');

// model
const Users = require('../models/Users.js');

class UserController {
  async store(req, res) {
    const schema = Yup.object({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
      admin: Yup.boolean(),
    });

    try {
      schema.validateSync(req.body, { abortEarly: false });
    } catch (err) {
      return res.status(400).json({ error: err.errors });
    }

    const { name, email, password, department, admin } = req.body;

    const userExists = await Users.findOne({
      where: {
        email,
      },
    });

    if (userExists) {
      return response.status(400).json({ error: 'User already exists' });
    }

    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    if (!department) {
      return res.status(400).json({ error: 'Make sure department selected' });
    }

    const user = await Users.create({
      id: uuidv4(),
      name,
      email,
      password,
      department,
      admin,
    });

    return res.status(201).json({
      id: user.id,
      name,
      email,
      department,
      admin,
    });
  }

  async update(req, res) {
    const schema = Yup.object({
      email: Yup.string().email(),
      password: Yup.string().min(6),
      department: Yup.string(),
    });

    try {
      schema.validateSync(req.body, { abortEarly: false });
    } catch (err) {
      return res.status(400).json({ error: err.errors });
    }

    const { id } = req.params;

    const findUser = await Users.findByPk(id);

    if (!findUser) {
      return response
        .status(400)
        .json({ error: 'Make sure your product ID is correct.' });
    }

    const { email, password, department } = req.body;

    await Users.update(
      {
        email,
        password,
        department,
      },
      {
        where: { id },
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

      const users = await Users.findAndCountAll({
        attributes: ['id', 'name', 'email', 'departament', 'admin'],
        limit,
        offset: (page - 1) * limit,
      });

      return response.status(200).json({
        total: users.count,
        pages: Math.ceil(users.count / limit),
        users: users.rows,
      });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ error: 'An error occurred while fetching users.' });
    }
  }
}

module.exports = new UserController();
