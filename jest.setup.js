
const { sequelize } = require('./src/database');

// Set up and tear down Sequelize before and after running tests
beforeAll(async () => {
  await sequelize.sync();
});

afterAll(async () => {
  await sequelize.close();
});
