require('dotenv').config();
const app = require('./app.js');
const { sequelize } = require('./database/index.js');

const port = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('📦 Database connected successfully.');

    app.listen(port, '0.0.0.0', () => {
      console.log(`🛜  Server running at port ${port}...`);
    });
  } catch (error) {
    console.error('❌  Database connection failed:', error);
  }
};

startServer();
