const db = require("../models");
const Record = db.stations;
const Op = db.Sequelize.Op;

// Retrieve all stations.
exports.findAll = (req, res) => {
  Record.findAll()
  .then(data => {
    res.send(data);
  })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving records."
      });
    });
};
