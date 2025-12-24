module.exports = (app) => {
  const records = require("../controllers/monthlyRecords.controller.js");
  const router = require("express").Router();

  // Najpierw bardziej szczegółowa trasa:
  router.get("/:id/:year", records.findAllByYear);

  // A potem ogólna, która obsługuje też zakres ?from=&to=
  router.get("/:id", records.findAll);

  app.use("/api/records/monthly", router);
};
