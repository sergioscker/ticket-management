const app = require('./app.js');
const { sequelize } = require('./database/index.js');

const port = process.env.PORT || 3000;

sequelize.authenticate().then(() => {
  app.listen(port, '0.0.0.0', () => {
    console.log(`🛜  Server running at port ${port}...`);
  });
});
