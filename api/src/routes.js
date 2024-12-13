const { Router } = require('express');

// middleware
const authMiddleware = require('./app/middlewares');

// controllers
const SessionController = require('./app/controllers/SessionController');
const UserController = require('./app/controllers/UserController');
const CreateTicketController = require('./app/controllers/CreateTicketController');
const TicketController = require('./app/controllers/TicketController');

const routes = new Router();

routes.get('/', (_, res) => {
  return res.json({ message: 'We are ready!' });
});

// login and update user.
routes.post('/session', SessionController.store);
routes.post('/user', UserController.store);

// intercepts all routes below
routes.use(authMiddleware);

// create and list user.
routes.get('/user', UserController.index);
routes.put('/user/:id', UserController.update);

// list, create and update ticket.
routes.get('/ticket', TicketController.index);
routes.post('/create-ticket', CreateTicketController.store);
routes.put('/ticket/:id', TicketController.update);

module.exports = { routes };
