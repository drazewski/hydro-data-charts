// routes/yearlyRecords.routes.js
module.exports = (app) => {
  const yearly = require("../controllers/yearlyRecords.controller.js");
  const router = require("express").Router();

  router.get("/withTemperature", yearly.findAllWithTemperatureIn2000); // dla wszystkich stacji z temperaturą w roku 2000
  // Uwaga: kolejność — najpierw bardziej szczegółowa
  router.get("/:id/:year", yearly.findByYear);
  router.get("/:id", yearly.findAll);
  
  app.use("/api/records/yearly", router);
};
