const { v4: uuidv4 } = require('uuid');
const Yup = require('yup');

// model
const Users = require('../models/Users.js');
const Departments = require('../models/Departments.js');

class DepartmentsController {
  async store(req, res) {
    // verify user admin
    const adminUser = await Users.findByPk(req.userId);

    if (!adminUser || !adminUser.admin) {
      return res
        .status(403)
        .json({ error: 'You do not have permission to create users.' });
    }

    // input validation
    const schema = Yup.object({
      title: Yup.string().required(),
    });

    try {
      schema.validateSync(req.body, { abortEarly: false });
    } catch (err) {
      return res.status(400).json({ error: err.errors });
    }

    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const department = await Departments.create({
      id: uuidv4(),
      title,
    });

    return res.status(201).json({
      id_department: department.id,
      title: department.title,
    });
  }

  async index(_, res) {
    const getDepartments = await Departments.findAll({
      include: [
        {
          model: Users,
          as: 'users',
          attributes: ['id', 'name'],
        },
      ],
    });
    return res.status(200).json(getDepartments);
  }
}

module.exports = new DepartmentsController();
