module.exports = (sequelize, DataTypes) => {
  const Airport = sequelize.define('Airport', {
    airport_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    code: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    city: {
      type: DataTypes.STRING(50)
    },
    country: {
      type: DataTypes.STRING(50)
    }
  }, {
    tableName: 'airport',
    timestamps: false
  });

  return Airport;
};