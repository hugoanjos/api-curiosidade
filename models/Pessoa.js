const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
    return sequelize.define('Pessoa', {
        Id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        Nome: { type: DataTypes.STRING, allowNull: false },
        Idade: { type: DataTypes.INTEGER, allowNull: false },
        Email: { type: DataTypes.STRING, allowNull: false },
        Endereco: { type: DataTypes.STRING },
        OutrasInformacoes: { type: DataTypes.STRING },
        Interesses: { type: DataTypes.STRING },
        Sentimentos: { type: DataTypes.STRING },
        Valores: { type: DataTypes.STRING },
        DataCadastro: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        Ativo: { type: DataTypes.BOOLEAN, defaultValue: true },
        Deletado: { type: DataTypes.BOOLEAN, defaultValue: false }
    }, { tableName: 'Pessoas', timestamps: false });
};