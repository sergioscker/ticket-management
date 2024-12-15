const { Ticket, User, Department, State } = require('../src/app/models');

module.exports = {
  async up(queryInterface, Sequelize) {
    const users = await User.findAll();
    const departments = await Department.findAll();
    const states = await State.findAll();

    const tickets = [];
    for (let i = 0; i < 100; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomDepartment =
        departments[Math.floor(Math.random() * departments.length)];
      const randomState = states[Math.floor(Math.random() * states.length)];

      tickets.push({
        title: `Ticket ${i + 1}`,
        description: `Description for ticket ${i + 1}`,
        observations: `Observations for ticket ${i + 1}`,
        id_state: randomState.id,
        id_department: randomDepartment.id,
        createdBy: randomUser.id,
        updatedBy: randomUser.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    await Ticket.bulkCreate(tickets);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Tickets', null, {});
  },
};
