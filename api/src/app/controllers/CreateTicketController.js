const Yup = require('yup');
const { v4: uuidv4 } = require('uuid');
const Tickets = require('../models/Tickets.js');
const Users = require('../models/Users.js');
const Departments = require('../models/Departments.js');
const States = require('../models/States.js');

class CreateTicketController {
  async store(req, res) {
    try {
      // Verifica o usuário autenticado
      const user = await Users.findByPk(req.userId, {
        include: [
          {
            model: Departments,
            as: 'department',
            attributes: ['id', 'title'],
          },
        ],
      });

      if (!user) {
        return res
          .status(400)
          .json({ error: 'Make sure the user has been created.' });
      }

      // Validação do payload
      const schema = Yup.object().shape({
        title: Yup.string().required(),
        description: Yup.string().required(),
        departmentId: Yup.string().when('admin', {
          is: true, // Só valida `departmentId` se o usuário for admin
          then: Yup.string().required('Department is required for admins.'),
          otherwise: Yup.string().notRequired(),
        }),
      });

      let validationErrors;

      try {
        schema.validateSync(
          { ...req.body, admin: user.admin },
          { abortEarly: false },
        );
      } catch (err) {
        validationErrors = err.errors;
      }

      if (validationErrors) {
        return res.status(400).json({ error: validationErrors });
      }

      const { title, description, departmentId } = req.body;

      // Determina o departamento: admin pode especificar, outros usam o vinculado
      const department =
        user.admin && departmentId
          ? await Departments.findByPk(departmentId)
          : user.department;

      if (!department) {
        return res
          .status(400)
          .json({ error: 'Invalid department. Please check the provided ID.' });
      }

      // Busca o estado padrão "Pending" no banco de dados
      const defaultState = await States.findOne({
        where: { title: 'Pending' },
      });

      if (!defaultState) {
        return res.status(500).json({
          error: 'Default state "Pending" not found. Please contact the admin.',
        });
      }

      // Cria o ticket com os dados fornecidos e state padrão
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
