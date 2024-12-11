import * as Yup from 'yup';
import Ticket from '../models/Tickets.js';
import User from '../models/Users.js';
import { Op } from 'sequelize';

export default class CreateTicketController {
  async store(req, res) {
    const schema = Yup.object({
      createdBy: Yup.number().required(),
      title: Yup.string.required(),
      description: Yup.string.required(),
      departament: Yup.string().required(),
    });

    try {
      schema.validateSync(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    const { title, description, departament } = req.body;

    const ticket = await Ticket.create({
      id: title,
      description,
      departament,
    });
    return res.status(201).json(ticket);
  }

  async update(req, res) {
    const schema = Yup.object({
      createdBy: Yup.number().required(),
      title: Yup.string,
      description: Yup.string,
      departament: Yup.string(),
    });

    try {
      schema.validateSync(req.body, { abortEarly: false });
    } catch (err) {
      return res.status(400).json({ error: err.errors });
    }

    const { admin: isAdmin } = await User.findByPk(req.userId);

    if (!isAdmin) {
      return res.status(401).json();
    }

    const { id } = req.params;

    const findTicket = await Ticket.findByPk(id);

    if (!findTicket) {
      return response
        .status(404)
        .json({ error: 'Make sure your ticket ID is correct.' });
    }

    if (['Rejected', 'Completed'].includes(findTicket.state)) {
      return res
        .status(400)
        .json({ error: 'Cannot update a rejected or finalized ticket.' });
    }

    const { createdBy, title, description, departament } = req.body;

    await Ticket.update(
      {
        createdBy,
        title,
        description,
        departament,
      },
      {
        where: { id },
      },
    );

    return res.status(200).json();
  }

  async index(req, res) {
    const { page = 1, limit = 10 } = req.query;

    try {
      const user = await User.findByPk(req.userId);

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
