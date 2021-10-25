'use strict';

module.exports = function (sequelize, DataTypes) {
  var Customer = sequelize.define('Customer', {
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    credit_card: DataTypes.TEXT,
    address_1: DataTypes.STRING(100),
    address_2: DataTypes.STRING(100),
    city: DataTypes.STRING(100),
    region: DataTypes.STRING(100),
    postal_code: DataTypes.STRING(100),
    country: DataTypes.STRING(100),
    shipping_region_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '1'
    },
    day_phone: DataTypes.STRING(100),
    eve_phone: DataTypes.STRING(100),
    mob_phone: DataTypes.STRING(100)

  }, {
    timestamps: false,
    tableName: 'customer',
    scopes: {
      withoutPassword: {
        attributes: { exclude: ['password'] }
      }
    }
  });
  Customer.associate = function (models) {
    // associations can be defined here
  };
  Customer.findByEmail = function (email) {
    var customer = Customer.findOne({
      where: { email: email }
    });

    return customer;
  };
  return Customer;
};