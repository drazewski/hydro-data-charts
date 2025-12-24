module.exports = (sequelize, Sequelize) => {
    const Record = sequelize.define("station", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      name: {
        type: Sequelize.TEXT,
      },
      water_name: {
        type: Sequelize.TEXT,
      },
      sid: {
        type: Sequelize.INTEGER
      }
    }, {
      tableName: 'stations',
      timestamps: false, 
    })
    return Record;
  };

  