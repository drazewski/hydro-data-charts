require("dotenv").config({ quiet: true });
const Sequelize = require("sequelize");

const parseNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const dbConfig = {
  HOST: process.env.DB_HOST || "localhost",
  USER: process.env.DB_USER,
  PASSWORD: process.env.DB_PASSWORD,
  DB: process.env.DB_NAME,
  PORT: parseNumber(process.env.DB_PORT, 3306),
  dialect: process.env.DB_DIALECT || "mysql",
  pool: {
    max: parseNumber(process.env.DB_POOL_MAX, 5),
    min: parseNumber(process.env.DB_POOL_MIN, 0),
    acquire: parseNumber(process.env.DB_POOL_ACQUIRE, 30000),
    idle: parseNumber(process.env.DB_POOL_IDLE, 10000)
  }
};

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: dbConfig.pool,
  port: dbConfig.PORT,
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.hydro_monthly = require("./monthlyRecord.model.js")(sequelize, Sequelize);
db.stations = require("./stations.model.js")(sequelize, Sequelize);
module.exports = db;
