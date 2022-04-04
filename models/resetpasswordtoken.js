'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ResetPasswordToken extends Model {
    static associate(models) {
      ResetPasswordToken.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      })
    }
  }
  ResetPasswordToken.init({
    userId: DataTypes.INTEGER,
    token: DataTypes.STRING,
    expired: DataTypes.DATE
   }, {
    sequelize,
    modelName: 'ResetPasswordToken',

  });
  return ResetPasswordToken;
};