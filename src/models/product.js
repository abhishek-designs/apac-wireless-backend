"use strict";
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    "Product",
    {
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      brand_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      model_no: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      discounted_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: "0.00",
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      in_stock: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      warrenty: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      image: DataTypes.STRING(150),
      image_2: DataTypes.STRING(150),
      thumbnail: DataTypes.STRING(150),
      tags: {
        type: DataTypes.STRING(350),
        allowNull: false,
      },
    },
    {
      timestamps: true,
      tableName: "product",
    }
  );
  Product.associate = function (models) {
    // associations can be defined here
    Product.hasMany(models.ProductAttribute, {
      foreignKey: "product_id",

      as: "productAttributes",
    });
    Product.belongsToMany(models.Category, {
      foreignKey: "product_id",
      through: "product_category",
    });
    Product.belongsTo(models.Features, {
      as: "feature",
      foreignKey: "feature_id",
    });
    Product.hasMany(models.RelatedProduct, {
      as: "related_products",
      foreignKey: "product_id",
    });
    Product.hasMany(models.Review, {
      as: "reviews",
      foreignKey: "product_id",
    });
  };
  return Product;
};
