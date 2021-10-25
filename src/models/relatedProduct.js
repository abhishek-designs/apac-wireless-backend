"use strict";
module.exports = (sequelize, DataTypes) => {
  const RelatedProduct = sequelize.define(
    "RelatedProduct",
    {
      related_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(100),
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
      in_stock: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      image: DataTypes.STRING(150),
    },
    {
      timestamps: false,
      tableName: "related_product",
    }
  );
  RelatedProduct.associate = function (models) {
    // associations can be defined here
    RelatedProduct.belongsTo(models.Product, {
      as: "product",
      foreignKey: "product_id",
    });
  };
  return RelatedProduct;
};
