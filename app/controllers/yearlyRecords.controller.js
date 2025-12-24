const db = require("../models");
const Record = db.hydro_monthly; // tabela miesięczna
const { Sequelize } = db;
const Op = db.Sequelize.Op;

/**
 * Wspólny fragment walidacji query z zakresem lat
 */
function parseRange(req) {
  const from = req.query.from !== undefined ? parseInt(req.query.from, 10) : undefined;
  const to = req.query.to !== undefined ? parseInt(req.query.to, 10) : undefined;

  if ((from !== undefined && Number.isNaN(from)) || (to !== undefined && Number.isNaN(to))) {
    return { error: "Invalid from/to" };
  }
  if ((from !== undefined && to === undefined) || (from === undefined && to !== undefined)) {
    return { error: "Both 'from' and 'to' are required" };
  }
  if (from !== undefined && to !== undefined && from > to) {
    return { error: "'from' cannot be greater than 'to'" };
  }
  return { from, to };
}

/**
 * Atrybut obliczeniowy: skorygowany rok
 * (XI–XII => poprzedni rok)
 */
const correctedYearSql = `CASE WHEN month IN (11,12) THEN year - 1 ELSE year END`;

const tempValid = `temperature <= 50`;

/**
 * Zestaw agregacji rocznych z warunkami po typie (1=min, 2=avg, 3=max)
 * i z uwzględnieniem sentinelowych wartości -> NULL.
 */
const yearlyAttributes = [
  // klucz grupowania (skorygowany rok)
  [Sequelize.literal(correctedYearSql), "year"],

  // LEVEL
  [Sequelize.fn("MIN", Sequelize.literal(`CASE WHEN type=1 THEN NULLIF(level, 9999) END`)), "minLevel"],
  [Sequelize.fn("MAX", Sequelize.literal(`CASE WHEN type=3 THEN NULLIF(level, 9999) END`)), "maxLevel"],
  [Sequelize.fn("AVG", Sequelize.literal(`CASE WHEN type=2 THEN NULLIF(level, 9999) END`)), "avgLevel"],

  // FLOW (jeśli masz sentinel dla flow, wstaw NULLIF(flow, XXX))
  [Sequelize.fn("MIN", Sequelize.literal(`CASE WHEN type=1 THEN flow END`)), "minFlow"],
  [Sequelize.fn("MAX", Sequelize.literal(`CASE WHEN type=3 THEN flow END`)), "maxFlow"],
  [Sequelize.fn("AVG", Sequelize.literal(`CASE WHEN type=2 THEN flow END`)), "avgFlow"],

  // TEMPERATURE — NOWE: odrzucamy wszystko > 50 °C
  [Sequelize.fn("MIN", Sequelize.literal(`CASE WHEN type=1 AND ${tempValid} THEN temperature END`)), "minTemperature"],
  [Sequelize.fn("MAX", Sequelize.literal(`CASE WHEN type=3 AND ${tempValid} THEN temperature END`)), "maxTemperature"],
  [Sequelize.fn("AVG", Sequelize.literal(`CASE WHEN type=2 AND ${tempValid} THEN temperature END`)), "avgTemperature"],
];

/**
 * GET /api/records/yearly/:id?from=YYYY&to=YYYY
 * - bez from/to: zwraca pełny zakres rocznych agregatów
 * - z from/to: filtr po skorygowanym roku
 */
exports.findAll = (req, res) => {
  const stationId = parseInt(req.params.id, 10);
  if (Number.isNaN(stationId)) {
    return res.status(400).send({ message: "Invalid station id" });
  }

  const { from, to, error } = parseRange(req);
  if (error) return res.status(400).send({ message: error });

  const where = { station_id: stationId };

  // gdy mamy zakres, filtrujemy po skorygowanym roku (literal + between)
  const havingOrWhereYear =
    from !== undefined && to !== undefined
      ? {
          [Op.and]: Sequelize.where(
            Sequelize.literal(correctedYearSql),
            { [Op.between]: [from, to] }
          ),
        }
      : {};

  Record.findAll({
    where,
    attributes: yearlyAttributes,
    group: [Sequelize.literal(correctedYearSql)],
    // filtr po skorygowanym roku w sekcji "where" z literalem (Sequelize.where)
    // dorzucamy go przez "havingOrWhereYear" (który tworzy [Op.and] z literalem)
    // Uwaga: w SQLite/MySQL/PG to podejście działa; jeśli używasz innego dialektu, można przenieść do HAVING.
    where: { ...where, ...havingOrWhereYear },
    order: [[Sequelize.literal("year"), "ASC"]],
    raw: true,
  })
    .then((rows) => {
      // rows są już zagregowane; upewnijmy się, że liczby są… liczbami ;)
      const out = rows.map((r) => ({
        year: Number(r.year),
        stationid: r.stationId,
        minlevel: r.minLevel != null ? Number(r.minLevel).toFixed(2) : null,
        avglevel: r.avgLevel != null ? Number(r.avgLevel).toFixed(2) : null,
        maxlevel: r.maxLevel != null ? Number(r.maxLevel).toFixed(2) : null,
        minflow: r.minFlow != null ? Number(r.minFlow).toFixed(2) : null,
        avgflow: r.avgFlow != null ? Number(r.avgFlow).toFixed(2) : null,
        maxflow: r.maxFlow != null ? Number(r.maxFlow).toFixed(2) : null,
        mintemperature: r.minTemperature != null ? Number(r.minTemperature).toFixed(2) : null,
        avgtemperature: r.avgTemperature != null ? Number(r.avgTemperature).toFixed(2) : null,
        maxtemperature: r.maxTemperature != null ? Number(r.maxTemperature).toFixed(2) : null,
      }));
      res.send(out);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving yearly records.",
      });
    });
};

/**
 * GET /api/records/yearly/:id/:year
 * - zwraca agregaty tylko dla jednego roku
 */
exports.findByYear = (req, res) => {
  const stationId = parseInt(req.params.id, 10);
  const year = parseInt(req.params.year, 10);

  if (Number.isNaN(stationId) || Number.isNaN(year)) {
    return res.status(400).send({ message: "Invalid station id or year" });
  }

  const where = { station_id: stationId };

  Record.findAll({
    where,
    attributes: yearlyAttributes,
    group: [Sequelize.literal(correctedYearSql)],
    // warunek: skorygowany rok = :year
    where: {
      ...where,
      [Op.and]: Sequelize.where(Sequelize.literal(correctedYearSql), year),
    },
    raw: true,
  })
    .then((rows) => {
      const r = rows[0];
      if (!r) return res.send([]);
      const out = {
        year: Number(r.year),
        stationId: r.stationId,
        minLevel: r.minLevel != null ? Number(r.minLevel).toFixed(2) : null,
        avgLevel: r.avgLevel != null ? Number(r.avgLevel).toFixed(2) : null,
        maxLevel: r.maxLevel != null ? Number(r.maxLevel).toFixed(2) : null,
        minFlow: r.minFlow != null ? Number(r.minFlow).toFixed(2) : null,
        avgFlow: r.avgFlow != null ? Number(r.avgFlow).toFixed(2) : null,
        maxFlow: r.maxFlow != null ? Number(r.maxFlow).toFixed(2) : null,
        minTemperature: r.minTemperature != null ? Number(r.minTemperature).toFixed(2) : null,
        avgTemperature: r.avgTemperature != null ? Number(r.avgTemperature).toFixed(2) : null,
        maxTemperature: r.maxTemperature != null ? Number(r.maxTemperature).toFixed(2) : null,
      };
      res.send([out]); // spójnie z findAll (zwracamy tablicę)
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving yearly records.",
      });
    });
};

exports.findAllWithTemperatureIn2000 = async (req, res) => {
  try {
    // 1. Znajdź stacje, które w 2000 roku mają avgTemperature != null
    const rows2000 = await Record.findAll({
      attributes: [
        "station_id",
        [Sequelize.literal(correctedYearSql), "year"],
        [Sequelize.fn("AVG", Sequelize.literal(`CASE WHEN type=2 AND ${tempValid} THEN temperature END`)), "avgTemperature"],
      ],
      where: {
        year: 2000,
      },
      group: ["station_id", Sequelize.literal(correctedYearSql)],
      raw: true,
    });

    const validStationIds = rows2000
      .filter((r) => r.avgTemperature != null)
      .map((r) => r.station_id);

    if (validStationIds.length === 0) {
      return res.send([]); // żadna stacja nie ma temperatury w 2000
    }

    // 2. Pobierz roczne dane dla wszystkich lat, tylko tych stacji
    const allRows = await Record.findAll({
      where: {
        station_id: { [Op.in]: validStationIds },
      },
      attributes: [
        ['station_id', 'stationId'],
        ...yearlyAttributes,
      ],
      group: ["station_id", Sequelize.literal(correctedYearSql)],
      order: [
        ["station_id", "ASC"],
        [Sequelize.literal("year"), "ASC"],
      ],
      raw: true,
    });

    const filteredRows = allRows.filter(r => r.avgTemperature != null);

    // 3. Sformatuj wynik
    const out = filteredRows.map((r) => ({
      stationId: r.stationId,
      year: Number(r.year),
      minTemperature: r.minTemperature != null ? Number(r.minTemperature).toFixed(2) : null,
      avgTemperature: r.avgTemperature != null ? Number(r.avgTemperature).toFixed(2) : null,
      maxTemperature: r.maxTemperature != null ? Number(r.maxTemperature).toFixed(2) : null,
    }));

    res.send(out);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving yearly records.",
    });
  }
};

