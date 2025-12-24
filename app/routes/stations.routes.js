module.exports = app => {
  const records = require("../controllers/stations.controller.js");
  var router = require("express").Router();
  // Retrieve all stations
  router.get("/", records.findAll);
  app.use('/api/stations', router);
};