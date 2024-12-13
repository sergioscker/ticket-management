const express = require('express');
require('./database/index.js');
const { routes } = require('./routes.js');

class App {
  constructor() {
    this.app = express();
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
