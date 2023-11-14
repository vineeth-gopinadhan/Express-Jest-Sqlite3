/* eslint-disable require-jsdoc */
const { testConnection, sequelize } = require('./database');
const app = require('./app');

init();

async function init() {
  try {
    await testConnection();
    await sequelize.sync();
    app.listen(3001, () => {
      console.log('Express App Listening on Port 3001');
    });
  } catch (error) {
    console.error(`An error occurred: ${JSON.stringify(error)}`);
    process.exit(1);
  }
}
