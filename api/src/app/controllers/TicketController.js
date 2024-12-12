import * as Yup from 'yup';
import { Op } from 'sequelize';

// models
import Users from '../models/Users.js';
import Ticket from '../models/Tickets.js';
import States from '../models/States.js';

class TicketController {
  async update(req, res) {
    const schema = Yup.object({
      title: Yup.string,
      description: Yup.string,
      departament: Yup.string(),
      id_state: Yup.string(),
      observations: Yup.string(),
    });

    // validate schema
    try {
      schema.validateSync(req.body, { abortEarly: false });
    } catch (err) {
      return res.status(400).json({ error: err.errors });
    }

    const user = await Users.findByPk(req.userId);

    // Admin verify
    if (!user.admin) {
      if (Object.keys(rest).length > 0 && !observations)
        return res
          .status(403)
          .json({ error: 'You dont have permission to update these fields.' });
    }

    const { id } = req.params;

    // Finding Ticket
    const findTicket = await Ticket.findByPk(id);

    if (!findTicket) {
      return response
        .status(404)
        .json({ error: 'Make sure your ticket ID is correct.' });
    }

    // Prevent changing "Refused" and "Finalized" states
    const immutableStates = ['Rejected', 'Completed'];
    const currentState = await States.findByPk(findTicket.id_state);

    if (immutableStates.includes(currentState.title)) {
      return res
        .status(400)
        .json({ error: 'Cannot update a rejected or finalized ticket.' });
    }

    // validate rejected states
    const newState = await States.findByPk(id_state);

    if (
      newState.title === 'Rejected' &&
      (!observations || observations.trim() === '')
    ) {
      return res.status(400).json({
        error: 'Observations are required when rejecting a ticket.',
      });
    }

    const { id_state, observations, ...rest } = req.body;

    // updated ticket
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
        return res.status(404).json({ error: 'User does not exists' });
      }

      const { state, search } = req.query;
      const filters = {};

      /* filters for states */
      if (state) {
        filters.state = { [Op.in]: state.split(',') }; // Support for multiple states
      }

      /* filters for texts */
      if (search) {
        filters[Op.or] = [
          { title: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
        ];
      }

      let tickets;

      /* Checks if user is admin */
      if (user.admin) {
        tickets = await Ticket.findAll({
          where: filters,

          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name'],
            },
          ],
          limit: Number(limit),
          offset: (page - 1) * limit,
        });
      } else {
        tickets = await Ticket.findAll({
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
              model: User,
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

export default new TicketController();
