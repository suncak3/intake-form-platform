const { Sequelize } = require('sequelize');
const config = require('../config/database')[process.env.NODE_ENV || 'development'];


const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  port: config.port,
  dialect: config.dialect,
  logging: false
});

const db = {
  sequelize,
  Sequelize,
  User: require('./User')(sequelize, Sequelize.DataTypes),
  Admin: require('./Admin')(sequelize, Sequelize.DataTypes),
  Form: require('./Form')(sequelize, Sequelize.DataTypes),
  Gender: require('./Gender')(sequelize, Sequelize.DataTypes),
  ProgrammingLanguage: require('./ProgrammingLanguage')(sequelize, Sequelize.DataTypes)
};

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;