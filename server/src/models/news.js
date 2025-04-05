// models/news.js
module.exports = (sequelize, DataTypes) => {
    const News = sequelize.define('News', {
      news_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      category: {
        type: DataTypes.ENUM('introduction', 'promotion', 'announcement', 'news'),
        defaultValue: 'news'
      },
      created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'admin',
          key: 'admin_id'
        }
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {
      tableName: 'news',
      timestamps: false
    });
  
    return News;
  };