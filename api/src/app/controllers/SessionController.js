const Yup = require('yup');
const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth.js');

// model
const Users = require('../models/Users.js');

class SessionController {
  async store(req, res) {
    const schema = Yup.object({
      email: Yup.string().email().required(),
      password: Yup.string().min(6).required(),
    });

    // Validate the request body
    const isValid = await schema.isValid(req.body);

    // Function to return error if email or password are incorrect
    const emailOrPasswordIncorrect = () => {
      res
        .status(401)
        .json({ error: 'Make sure your email or password are correct.' });
    };

    // If validation fails, return error
    if (!isValid) {
      return emailOrPasswordIncorrect();
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await Users.findOne({
      where: {
        email,
      },
    });

    // If user not found, return error
    if (!user) {
      return emailOrPasswordIncorrect();
    }

    // Check if password matches
    const isSamePassword = await user.comparePassword(password);

    // If password does not match, return error
    if (!isSamePassword) {
      return emailOrPasswordIncorrect();
    }

    // Generate JWT token for the user
    return res.status(201).json({
      id: user.id,
      name: user.name,
      email,
      admin: user.admin,
      token: jwt.sign({ id: user.id, name: user.name }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

module.exports = new SessionController();
