import { v4 as uuidv4 } from 'uuid';
import * as Yup from 'yup';

import User from '../models/Users';

export default class UserController {
  async store(req, res) {
    const schema = Yup.object({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
      departament: Yup.string().required(),
      admin: Yup.boolean(),
    });

    try {
      schema.validateSync(req.body, { abortEarly: false });
    } catch (err) {
      return res.status(400).json({ error: err.errors });
    }

    const { name, email, password, departament, admin } = req.body;

    

    const user = await User.create({
      id: uuidv4(),
      name,
      email,
      password,
      departament,
      admin,
    });

    return res.status(201).json(user);
  }
}
