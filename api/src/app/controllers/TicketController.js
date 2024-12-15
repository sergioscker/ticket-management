const Yup = require('yup');
const { Op } = require('sequelize');

// Models
const Users = require('../models/Users.js');
const Tickets = require('../models/Tickets.js');
const States = require('../models/States.js');
const Departments = require('../models/Departments.js');

class TicketController {
  async update(req, res) {
    try {
      // Validação do payload
      const schema = Yup.object().shape({
        title: Yup.string(),
        description: Yup.string(),
        observations: Yup.string(),
        id_state: Yup.string().uuid(),
      });

      await schema.validate(req.body, { abortEarly: false });

      const { id } = req.params;
      const { id_state, observations, ...rest } = req.body;

      // Buscar ticket pelo ID
      const ticket = await Tickets.findByPk(id, {
        include: [{ model: States, as: 'state', attributes: ['id', 'title'] }],
      });

      if (!ticket) {
        return res.status(404).json({ error: 'Ticket not found.' });
      }

      // Buscar usuário autenticado
      const user = await Users.findByPk(req.userId);

      if (!user || !user.admin) {
        return res
          .status(403)
          .json({ error: 'You dont have permission to update ticket states.' });
      }

      // Verificar se o estado existe
      const state = await States.findByPk(id_state);
      if (!state) {
        return res.status(404).json({ error: 'State not found.' });
      }

      // Buscar os estados imutáveis diretamente do banco
      const immutableStates = await States.findAll({
        where: { title: { [Op.in]: ['Rejected', 'Finalized'] } },
        attributes: ['id', 'title'],
      });

      const immutableStateIds = immutableStates.map((state) => state.id);

      // Verificar se o estado atual é imutável
      if (immutableStateIds.includes(ticket.id_state)) {
        return res
          .status(400)
          .json({ error: 'Cannot update a rejected or finalized ticket.' });
      }

      // Validação adicional ao rejeitar o ticket
      if (id_state) {
        const newState = await States.findByPk(id_state);

        if (!newState) {
          return res.status(400).json({ error: 'Invalid state ID.' });
        }

        if (
          newState.title === 'Rejected' &&
          (!observations || observations.trim() === '')
        ) {
          return res.status(400).json({
            error: 'Observations are required when rejecting a ticket.',
          });
        }
      }

      // Atualização somente por administradores ou com observações
      if (!user.admin && !observations) {
        return res
          .status(403)
          .json({ error: 'Observations are required for this update.' });
      }

      // Atualizar ticket
      await ticket.update({
        ...rest,
        id_state,
        observations,
        updatedBy: user.id,
      });

      return res.status(200).json(ticket);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error updating ticket.' });
    }
  }

  async index(req, res) {
    try {
      const { page = 1, limit = 10, state, search } = req.query;

      // Filtros iniciais
      const filters = {};

      if (state) {
        filters.id_state = { [Op.in]: state.split(',') };
      }

      if (search) {
        filters[Op.or] = [
          { title: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
        ];
      }

      // Buscar usuário autenticado
      const user = await Users.findByPk(req.userId, {
        include: [
          { model: Departments, as: 'department', attributes: ['id', 'title'] },
        ],
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      // Adicionar filtros específicos para não administradores
      if (!user.admin) {
        filters[Op.or] = [
          { createdBy: user.id },
          { id_department: user.department.id },
        ];
      }

      // Buscar tickets com paginação
      const { rows: tickets } = await Tickets.findAndCountAll({
        where: filters,
        include: [
          {
            model: Users,
            as: 'creator',
            attributes: ['id', 'name'],
          },
          {
            model: Users,
            as: 'updator',
            attributes: ['id', 'name'],
          },
          {
            model: Departments,
            as: 'department',
            attributes: ['id', 'title'],
          },
          {
            model: States,
            as: 'state',
            attributes: ['id', 'title'],
          },
        ],
        limit: Number(limit),
        offset: (page - 1) * limit,
        order: [['createdAt', 'DESC']],
      });

      return res.status(200).json(tickets);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error fetching tickets.' });
    }
  }
}

module.exports = new TicketController();
