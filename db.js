import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize(process.env.DB_CONNECTION_STRING, {
    dialect: 'mssql',
    dialectOptions: { options: { encrypt: true } }
});

export default sequelize;