import { Router } from 'express';
import PessoaModel from '../models/Pessoa.js';
import sequelize from '../db.js';
import { Op } from 'sequelize';
import authenticateToken from '../auth.js';
import dayjs from 'dayjs';

const Pessoa = PessoaModel(sequelize);
const router = Router();

// Buscar todos
router.get('/', authenticateToken, async (req, res) => {
    const pessoas = await Pessoa.findAll();
    res.json(pessoas);
});

// Dashboard
router.get('/dashboard', authenticateToken, async (req, res) => {
    const pessoas = await Pessoa.findAll();

    // Total cadastros
    const totalCadastros = pessoas.length;

    // Cadastros do último mês
    const mesAtual = dayjs().month() + 1;
    const cadastrosUltimoMes = pessoas.filter(p => {
        return p.DataCadastro && dayjs(p.DataCadastro).month() + 1 === mesAtual;
    }).length;

    // Cadastros pendentes
    const cadastrosPendentes = pessoas.filter(p => {
        return Object.values(p.toJSON()).some(v => v === "" || v === null || v === undefined);
    }).length;

    res.json({
        TotalCadastros: totalCadastros,
        CadastrosUltimoMes: cadastrosUltimoMes,
        CadastrosPendentes: cadastrosPendentes
    });
});

// Buscar por ID/Buscar por Nome ou Email
router.get('/:busca', authenticateToken, async (req, res) => {
    const { busca } = req.params;
    if (!isNaN(busca)) {
        const pessoa = await Pessoa.findByPk(busca);
        if (!pessoa) {
            return res.status(404).json({ error: 'Pessoa não encontrada' });
        }
        return res.json(pessoa);
    }
    const pessoa = await Pessoa.findOne({
        where: {
            [Op.or]: [
                { Nome: busca },
                { Email: busca }
            ]
        }
    });
    if (!pessoa) {
        return res.status(404).json({ error: 'Pessoa não encontrada' });
    }
    return res.json(pessoa);
});

// Criar pessoa
router.post('/', authenticateToken, async (req, res) => {
    const { Nome, Idade, Email, Endereco, OutrasInformacoes, Interesses, Sentimentos, Valores } = req.body;
    if (!Nome || !Idade || !Email) {
        return res.status(400).json({ error: 'Dados obrigatórios faltando' });
    }
    const pessoaCriada = await Pessoa.create({
        Nome, Idade, Email, Endereco, OutrasInformacoes, Interesses, Sentimentos, Valores
    });
    return res.status(201).json(pessoaCriada);
});

// Atualizar pessoa
router.put('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { Nome, Idade, Email, Endereco, OutrasInformacoes, Interesses, Sentimentos, Valores, Ativo, Deletado } = req.body;
    const pessoa = await Pessoa.findByPk(id);
    if (!pessoa) {
        return res.status(404).json({ error: 'Pessoa não encontrada' });
    }
    pessoa.Nome = Nome ?? pessoa.Nome;
    pessoa.Idade = Idade ?? pessoa.Idade;
    pessoa.Email = Email ?? pessoa.Email;
    pessoa.Endereco = Endereco ?? pessoa.Endereco;
    pessoa.OutrasInformacoes = OutrasInformacoes ?? pessoa.OutrasInformacoes;
    pessoa.Interesses = Interesses ?? pessoa.Interesses;
    pessoa.Sentimentos = Sentimentos ?? pessoa.Sentimentos;
    pessoa.Valores = Valores ?? pessoa.Valores;
    pessoa.Ativo = Ativo ?? pessoa.Ativo;
    pessoa.Deletado = Deletado ?? pessoa.Deletado;
    await pessoa.save();
    return res.json(pessoa);
});

// Deletar pessoa
router.delete('/:id', authenticateToken, async (req, res) => {
    const pessoa = await Pessoa.findByPk(req.params.id);
    if (!pessoa) {
        return res.status(404).json({ error: 'Pessoa não encontrada' });
    }
    await pessoa.destroy();
    res.status(204).send();
});

// Filtrar por nome ou email
router.get('/filtrar/:busca', authenticateToken, async (req, res) => {
    const busca = req.params.busca;
    if (!busca) {
        return res.status(400).json({ error: 'A busca não pode ser vazia' });
    }
    const pessoas = await Pessoa.findAll({
        where: {
            [Op.or]: [
                { Nome: { [Op.like]: `%${busca}%` } },
                { Email: { [Op.like]: `%${busca}%` } }
            ]
        }
    });
    if (!pessoas.length) {
        return res.status(404).json({ error: 'Pessoa não encontrada' });
    }
    res.json(pessoas);
});

export default router;