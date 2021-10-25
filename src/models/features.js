"use strict";
module.exports = (sequelize, DataTypes) => {
  const Features = sequelize.define(
    "Features",
    {
      feature_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      ram: {
        type: DataTypes.STRING(100),
      },
      storage: {
        type: DataTypes.STRING(1000),
      },
      color: {
        type: DataTypes.STRING(100),
      },
      battery: {
        type: DataTypes.INTEGER,
      },
      screen_type: {
        type: DataTypes.STRING(150),
      },
      processor: {
        type: DataTypes.STRING(150),
      },
      camera: {
        type: DataTypes.STRING(150),
      },
      os: {
        type: DataTypes.STRING(150),
      },
      sreen_lock: {
        type: DataTypes.STRING(400),
      },
    },
    {
      timestamps: false,
      tableName: "features",
    }
  );
  Features.associate = function (models) {
    // associations can be defined here
    Features.hasMany(models.Product, {
      as: "feature",
      foreignKey: "feature_id",
    });
  };
  return Features;
};

// Contains
// 1 Mobile phone
// 2 Adapter
// 3 USB TYPE C
// 4 sIM EJECT TOOL
// 5 WARRANTY CARD

// const User = sequelize.define('User', { name: DataTypes.STRING });
// const Post = sequelize.define('Post', { title: DataTypes.STRING });
// User.hasMany(Post); // User has many posts
// Post.belongsTo(User); // Many posts has only one user

// Features.hasMany(Product) // Features has many products
// Product.belongsTo(Features) // Product will have only one feature
