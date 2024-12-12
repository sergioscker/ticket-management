import * as Yup from 'yup';

// models
import Ticket from '../models/Tickets.js';

class CreateTicketController {
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
}

export default new CreateTicketController();
