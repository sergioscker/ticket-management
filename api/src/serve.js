import app from '../src/app.js';

const port = process.env.PORT || 3000;

database.authenticate().then(() => {
  app
    .listen(port, '0.0.0.0', () => {
      console.log(`🛜 Server running at port ${port}...`);
    })
    .cath((error) => {
      console.error('Failed to connect to the database:', error);
    });
});
