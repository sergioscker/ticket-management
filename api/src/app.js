import express from 'express';
import cors from 'cors';
import './database/index.js';
import routes from './routes.js';

const corsOptions = {
  origin: ['https://ticket-managment.vercel.app'],
  Credential: true,
};

class App {
  constructor() {
    this.app = express();
    this.cors.use(cors(corsOptions));
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(express.json());
  }

  routes() {
    this.app.use(routes);
  }
}

export default new App().app;
