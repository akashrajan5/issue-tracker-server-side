const { Sequelize } = require('sequelize');

const database = 'issuetracker';
const username = 'root';
const password = 'akashroot';

const sequelize = new Sequelize(database, username, password, {
    host: 'localhost',
    dialect: 'mysql'
});

async function checkConnection() {
    try {
        await sequelize.authenticate();
        return 'Connection has been established successfully.';
    } catch (error) {
        return 'Unable to connect to the database:', error;
    }
}


module.exports = {
    sequelize: sequelize,
    checkConn: checkConnection
};