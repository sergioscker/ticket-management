const { Router } = require('express');

// middleware
const authMiddleware = require('./app/middlewares');

// controllers
const SessionController = require('./app/controllers/SessionController');
const UserController = require('./app/controllers/UserController');
const CreateTicketController = require('./app/controllers/CreateTicketController');
const TicketController = require('./app/controllers/TicketController');
const DepartmentsController = require('./app/controllers/DepartmentsController');
const StatesController = require('./app/controllers/StatesController');

const routes = new Router();

routes.get('/', (_, res) => {
  return res.json({ message: 'We are ready!🚀' });
});

// login and update user.
routes.post('/session', SessionController.store);

// intercepts all routes below
routes.use(authMiddleware);

// create, update, update and list departments and states
routes.get('/departments', DepartmentsController.index);
routes.post('/departments', DepartmentsController.store);

routes.get('/states', StatesController.index);
routes.post('/states', StatesController.store);

// create and list user.
routes.get('/users', UserController.index);
routes.post('/users', UserController.store);
routes.put('/users', UserController.update);

// list, create and update ticket.
routes.get('/tickets', TicketController.index);
routes.post('/create-ticket', CreateTicketController.store);
routes.put('/ticket/:id', TicketController.update);

module.exports = { routes };
