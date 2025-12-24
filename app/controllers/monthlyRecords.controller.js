const db = require("../models");
const Record = db.hydro_monthly;
const Op = db.Sequelize.Op;

// Wspólne przetwarzanie: nullowanie wartości sentinelowych,
// korekta roku dla XI–XII (listopad/grudzień -> poprzedni rok),
// sprzątanie zbędnych pól.
const processRecords = (rows) =>
  rows.map((record) => {
    const r = record.toJSON ? record.toJSON() : record;

    if (r.temperature != null && r.temperature > 50) r.temperature = null;
    if (r.level == 9999) r.level = null;

    // listopad/grudzień liczymy do poprzedniego roku
    if (r.month === 11 || r.month === 12) {
      r.year -= 1;
    }

    delete r.station_id;
    delete r.h_month;

    return r;
  });

// GET /api/records/monthly/:id?from=YYYY&to=YYYY
// - bez from/to: zwraca wszystkie rekordy danej stacji (po korekcie roku)
// - z from/to: zwraca tylko rekordy w zakresie (po korekcie roku)
exports.findAll = (req, res) => {
  const stationId = parseInt(req.params.id, 10);
  const from = req.query.from !== undefined ? parseInt(req.query.from, 10) : undefined;
  const to = req.query.to !== undefined ? parseInt(req.query.to, 10) : undefined;

  if (Number.isNaN(stationId)) {
    return res.status(400).send({ message: "Invalid station id" });
  }
  if ((from !== undefined && Number.isNaN(from)) || (to !== undefined && Number.isNaN(to))) {
    return res.status(400).send({ message: "Invalid from/to" });
  }
  if ((from !== undefined && to === undefined) || (from === undefined && to !== undefined)) {
    return res.status(400).send({ message: "Both 'from' and 'to' are required" });
  }
  if (from !== undefined && to !== undefined && from > to) {
    return res.status(400).send({ message: "'from' cannot be greater than 'to'" });
  }

  // Podstawowy warunek
  const where = { station_id: stationId };

  // Mikro-optymalizacja: przy zakresie lat pobierz z 1-rocznym buforem,
  // bo XI–XII po korekcie przesuwają się o rok. Dokładne cięcie zrobimy po mapowaniu.
  if (from !== undefined && to !== undefined) {
    where.year = { [Op.gte]: from - 1, [Op.lte]: to + 1 };
  }

  Record.findAll({ where })
    .then((data) => {
      const processed = processRecords(data);

      const filtered =
        from !== undefined && to !== undefined
          ? processed.filter((r) => r.year >= from && r.year <= to)
          : processed;

      res.send(filtered);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: err.message || "Some error occurred while retrieving records." });
    });
};

// GET /api/records/monthly/:id/:year  (kompatybilny stary endpoint)
exports.findAllByYear = (req, res) => {
  const stationId = parseInt(req.params.id, 10);
  const year = parseInt(req.params.year, 10);

  if (Number.isNaN(stationId) || Number.isNaN(year)) {
    return res.status(400).send({ message: "Invalid station id or year" });
  }

  const where = {
    station_id: stationId,
    // bufor dla XI–XII, dokładne cięcie po korekcie
    year: { [Op.gte]: year - 1, [Op.lte]: year + 1 },
  };

  Record.findAll({ where })
    .then((data) => {
      const processed = processRecords(data).filter((r) => r.year === year);
      res.send(processed);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: err.message || "Some error occurred while retrieving records." });
    });
};
