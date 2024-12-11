import app from '../src/app.js';
import database from './database/index.js';

const port = process.env.PORT || 3000;

database.authenticate().then(() => {
  app.listen(port, '0.0.0.0', () => {
    console.log(`🛜  Server running at port ${port}...`);
  });
});
