const Yup = require('yup');

// model
const Tickets = require('../models/Tickets.js');

class CreateTicketController {
  async store(req, res) {
    // Validation schema for creating a ticket
    const schema = Yup.object({
      title: Yup.string().required(),
      description: Yup.string().required(),
      department: Yup.string().required(),
    });

    // Validate the request body
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

    const { title, description, department } = req.body;

    // Create a new ticket
    const ticket = await Tickets.create({
      title,
      description,
      department,
    });

    // Return the created ticket
    return res.status(201).json(ticket);
  }
}

module.exports = new CreateTicketController();
