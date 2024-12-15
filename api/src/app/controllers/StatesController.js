const { v4: uuidv4 } = require('uuid');
const Yup = require('yup');

// model
const Users = require('../models/Users.js');
const States = require('../models/States.js');
const Tickets = require('../models/Tickets.js');

class StatesController {
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

    const states = await States.create({
      id: uuidv4(),
      title,
    });

    return res.status(201).json({
      id_states: states.id,
      title: states.title,
    });
  }

  async index(_, res) {
    const getStates = await States.findAll({
      include: [
        {
          model: Tickets,
          as: 'ticket',
          attributes: ['id', 'title'],
        },
      ],
    });
    return res.status(200).json(getStates);
  }
}

module.exports = new StatesController();
