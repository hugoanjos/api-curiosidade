import { Router } from 'express';
import bcrypt from 'bcrypt';
import UsuarioModel from '../models/Usuario.js';
import sequelize from '../db.js';
import { Op } from 'sequelize';
import authenticateToken from '../auth.js';
import jwt from 'jsonwebtoken';

const Usuario = UsuarioModel(sequelize);
const router = Router();

// Buscar todos
router.get('/', authenticateToken, async (req, res) => {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
});

// Buscar por ID/Buscar por Nome ou Email
router.get('/:busca', authenticateToken, async (req, res) => {
    const { busca } = req.params;

    // se busca é um número, busca por id
    if (!isNaN(busca)) {
        const usuario = await Usuario.findByPk(busca);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        return res.json(usuario);
    }

    // se busca não é um número, busca por nome/email
    const usuario = await Usuario.findOne({
        where: {
            [Op.or]: [
                { Nome: busca },
                { Email: busca }
            ]
        }
    });
    if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    return res.json(usuario);
});

// Criar
router.post('/', async (req, res) => {
    const { Nome, Email, Senha } = req.body;
    if (!Nome || !Email || !Senha) {
        return res.status(400).json({ error: 'Dados inválidos' });
    }

    const existe = await Usuario.findOne({ where: { Email } });
    if (existe) {
        return res.status(400).json({ error: 'Usuário já cadastrado' });
    }

    const hashedPassword = await bcrypt.hash(Senha, 10);
    const usuarioCriado = await Usuario.create({ Nome, Email, Senha: hashedPassword });
    return res.status(201).json(usuarioCriado);
});

// Atualizar
router.put('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { Nome, Email, Senha } = req.body;

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    usuario.Nome = Nome ?? usuario.Nome;
    usuario.Email = Email ?? usuario.Email;
    if (Senha) {
        usuario.Senha = await bcrypt.hash(Senha, 10);
    }
    await usuario.save();

    return res.json(usuario);
});

// Deletar
router.delete('/:id', authenticateToken, async (req, res) => {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    await usuario.destroy();
    res.status(204).send();
});

// Filtrar por nome ou email
router.get('/filtrar/:busca', authenticateToken, async (req, res) => {
    const busca = req.params.busca;
    if (!busca) {
        return res.status(400).json({ error: 'A busca não pode ser vazia' });
    }
    const usuarios = await Usuario.findAll({
        where: {
            [Op.or]: [
                { Nome: { [Op.like]: `%${busca}%` } },
                { Email: { [Op.like]: `%${busca}%` } }
            ]
        }
    });
    if (!usuarios.length) {
        return res.status(404).json({ error: 'Pessoa não encontrada' });
    }
    res.json(usuarios);
});

// Login
router.post('/login', async (req, res) => {
    const { Email, Senha } = req.body;
    if (!Email || !Senha) {
        return res.status(400).json({ error: 'Dados inválidos' });
    }

    const usuario = await Usuario.findOne({ where: { Email } });
    if (!usuario) {
        return res.status(401).json({ error: 'Email inválido' });
    }

    const senhaValida = await bcrypt.compare(Senha, usuario.Senha);
    if (!senhaValida) {
        return res.status(401).json({ error: 'Senha incorreta' });
    }

    const token = jwt.sign(
        { id: usuario.id, email: usuario.Email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    res.json({ token });
});

export default router;