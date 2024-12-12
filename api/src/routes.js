import { Router } from 'express';

// middleware
import authMiddleware from './app/middlewares/index.js';

// controllers
import SessionController from './app/controllers/SessionController.js';
import UserController from './app/controllers/UserController.js';
import CreateTicketController from './app/controllers/CreateTicketController.js';
import TicketController from './app/controllers/TicketController.js';

export const routes = new Router();

routes.get('/', (_, res) => {
  return res.json({ message: 'We are ready!' });
});

// login and update user.
routes.post('/', SessionController.store);
routes.put('/user/:id', UserController.update);

// intercepts all routes below
routes.use(authMiddleware);

// create and list user.
routes.get('/user', UserController.index);
routes.post('/user', UserController.store);

// list, create and update ticket.
routes.get('/ticket', TicketController.index);
routes.post('/create-ticket', CreateTicketController.store);
routes.put('/ticket/:id', TicketController.update);
