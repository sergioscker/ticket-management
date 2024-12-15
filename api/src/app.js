const express = require('express');
require('./database/index.js');
const { routes } = require('./routes.js');
const cors = require('cors');

// CORS configurantion
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
};
class App {
  constructor() {
    this.app = express();
    this.app.use(cors(corsOptions));
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

module.exports = new App().app;
