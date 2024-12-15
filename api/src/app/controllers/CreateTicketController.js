const Yup = require('yup');
const { v4: uuidv4 } = require('uuid');
const Tickets = require('../models/Tickets.js');
const Users = require('../models/Users.js');
const Departments = require('../models/Departments.js');
const States = require('../models/States.js');

class CreateTicketController {
  async store(req, res) {
    try {
      // Busca o usuário autenticado
      const user = await Users.findByPk(req.userId, {
        attributes: ['id', 'name', 'admin'],
      });

      if (!user) {
        return res
          .status(400)
          .json({ error: 'Make sure the user is authenticated.' });
      }

      // Validação do payload
      const schema = Yup.object().shape({
        title: Yup.string().required('Title is required.'),
        description: Yup.string().required('Description is required.'),
        departmentId: Yup.string().required('Department is required.'),
      });

      let validationErrors;
      try {
        schema.validateSync(req.body, { abortEarly: false });
      } catch (err) {
        validationErrors = err.errors;
      }

      if (validationErrors) {
        return res.status(400).json({
          error: 'Validation failed',
          messages: validationErrors,
        });
      }

      const { title, description, departmentId } = req.body;

      // Verifica se o departamento selecionado é válido
      const department = await Departments.findByPk(departmentId);

      if (!department) {
        return res.status(400).json({
          error: 'Invalid department. Please select a valid department.',
        });
      }

      // Busca o estado padrão "Pending"
      const defaultState = await States.findOne({
        where: { title: 'Pending' },
      });

      if (!defaultState) {
        return res.status(500).json({
          error: 'Default state "Pending" not found. Please contact the admin.',
        });
      }

      // Cria o ticket
      const ticket = await Tickets.create({
        id: uuidv4(),
        title,
        description,
        id_department: department.id,
        id_state: defaultState.id,
        createdBy: user.id,
      });

      // Retorna o ticket com detalhes adicionais
      const ticketWithDetails = await Tickets.findByPk(ticket.id, {
        include: [
          {
            model: Users,
            as: 'creator',
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
      });

      return res.status(201).json(ticketWithDetails);
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ error: 'An error occurred while creating the ticket.' });
    }
  }
}

module.exports = new CreateTicketController();
