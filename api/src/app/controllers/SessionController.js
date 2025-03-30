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

    // Validate request body
    if (!(await schema.isValid(req.body))) {
      return res
        .status(401)
        .json({ error: 'Make sure your email or password are correct.' });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await Users.findOne({
      where: {
        email,
      },
    });

    if (!user || !(await user.comparePassword(password))) {
      return res
        .status(401)
        .json({ error: 'Make sure your email or password are correct.' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, name: user.name },
      authConfig.secret,
      {
        expiresIn: authConfig.expiresIn,
      },
    );

    // cookie HTTP-Only configurate
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    });

    return res.status(200).json({
      id: user.id,
      name: user.name,
      email,
      admin: user.admin,
      token,
    });
  }

  async logout(_, res) {
    res.clearCookie('token');
    return res.status(200).json({ message: 'Logged out sucessfully' });
  }
}

module.exports = new SessionController();
