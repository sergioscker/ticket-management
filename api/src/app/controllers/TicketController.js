const Yup = require('yup');
const { Op } = require('sequelize');

// model
const Users = require('../models/Users.js');
const Tickets = require('../models/Tickets.js');
const States = require('../models/States.js');

class TicketController {
  async update(req, res) {
    // Schema validation for ticket updates
    const schema = Yup.object({
      title: Yup.string(),
      description: Yup.string(),
      observations: Yup.string(),
    });

    // Validate the request body against the schema
    let validationErrors;
    try {
      schema.validateSync(req.body, { abortEarly: false });
    } catch (err) {
      validationErrors = err.errors;
    }

    // If validation fails, return error response
    if (validationErrors) {
      return res.status(400).json({ error: validationErrors });
    }

    // Get user details
    const user = await Users.findByPk(req.userId);

    // Admin check
    if (!user.admin) {
      const { observations, ...rest } = req.body;
      // If user is not admin and tries to modify fields without observations, return error
      if (Object.keys(rest).length > 0 && !observations) {
        return res
          .status(403)
          .json({ error: 'You don’t have permission to update these fields.' });
      }
    }

    const { id } = req.params;

    // Find the ticket by its ID
    const findTicket = await Tickets.findByPk(id);

    if (!findTicket) {
      return res
        .status(404)
        .json({ error: 'Make sure your ticket ID is correct.' });
    }

    // Prevent updating for "Rejected" and "Finalized" states
    const immutableStates = ['Rejected', 'Completed'];
    const currentState = await States.findByPk(findTicket.id_state);

    if (immutableStates.includes(currentState.title)) {
      return res
        .status(400)
        .json({ error: 'Cannot update a rejected or finalized ticket.' });
    }

    // Validate rejected states
    const { id_state, observations, ...rest } = req.body;

    if (
      newState.title === 'Rejected' &&
      (!observations || observations.trim() === '')
    ) {
      return res.status(400).json({
        error: 'Observations are required when rejecting a ticket.',
      });
    }

    // Update ticket details
    await findTicket.update(
      {
        id_state,
        observations,
        ...rest,
      },
      {
        where: { id },
      },
    );

    return res.status(200).json(findTicket);
  }

  async index(req, res) {
    const { page = 1, limit = 10 } = req.query;

    try {
      const user = await Users.findByPk(req.userId);

      if (!user) {
        return res.status(404).json({ error: 'User does not exist' });
      }

      const { state, search } = req.query;
      const filters = {};

      // Filters for states
      if (state) {
        filters.state = { [Op.in]: state.split(',') }; // Support for multiple states
      }

      // Filters for text search
      if (search) {
        filters[Op.or] = [
          { title: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
        ];
      }

      let tickets;

      // Check if the user is an admin
      if (user.admin) {
        tickets = await Tickets.findAll({
          where: filters,
          include: [
            {
              model: Users,
              as: 'user',
              attributes: ['id', 'name'],
            },
          ],
          limit: Number(limit),
          offset: (page - 1) * limit,
        });
      } else {
        tickets = await Tickets.findAll({
          where: {
            [Op.and]: [
              filters,
              {
                [Op.and]: [
                  { departament: user.departament },
                  { createdBy: user.id },
                ],
              },
            ],
          },
          include: [
            {
              model: Users,
              as: 'user',
              attributes: ['id', 'name'],
            },
          ],
          limit: Number(limit),
          offset: (page - 1) * limit,
        });
      }

      return res.status(200).json(tickets);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error finding ticket' });
    }
  }
}

module.exports = new TicketController();
