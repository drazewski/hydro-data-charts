const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  },
  port: 3306,
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.hydro_monthly = require("./monthlyRecord.model.js")(sequelize, Sequelize);
db.stations = require("./stations.model.js")(sequelize, Sequelize);
module.exports = db;