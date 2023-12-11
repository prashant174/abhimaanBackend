const { Sequelize } = require('sequelize');
require("dotenv").config()

const sequelize = new Sequelize(process.env.database, 'root', process.env.sqlPassword, {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
