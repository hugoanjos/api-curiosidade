const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
    return sequelize.define('Usuario', {
        Id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        Nome: { type: DataTypes.STRING, allowNull: true },
        Email: { type: DataTypes.STRING, allowNull: true },
        Senha: { type: DataTypes.STRING, allowNull: true },
        Deletado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
    }, { tableName: 'Usuarios', timestamps: false });
};