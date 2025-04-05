module.exports = (sequelize, DataTypes) => {
    const Airplane = sequelize.define('Airplane', {
      airplane_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      code: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true
        }
      },
      manufacturer: {
        type: DataTypes.STRING(50)
      },
      model: {
        type: DataTypes.STRING(50)
      },
      total_seats: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: true,
          min: 1
        }
      }
    }, {
      tableName: 'airplane',
      timestamps: false
    });
  
    return Airplane;
  };