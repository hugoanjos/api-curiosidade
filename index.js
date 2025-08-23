import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import sequelize from './db.js';
import UsuarioModel from './models/Usuario.js';
import PessoaModel from './models/Pessoa.js';

const app = express();
app.use(express.json()); 

const Usuario = UsuarioModel(sequelize);
const Pessoa = PessoaModel(sequelize);

app.get('/', (req, res) => {
	res.send('API do Projeto Operação Curiosidade.');
});

sequelize.sync().then(() => {
	app.listen(3000, () => {
    console.log('Servidor api-curiosidade rodando na porta 3000');
	});
}).catch(err => {
	console.error('Erro ao conectar com banco.', err);
});