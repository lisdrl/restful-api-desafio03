const conexao = require('../conexao');
const bcrypt = require('bcrypt');

const cadastrarUsuario = async (req, res) => {
    const { nome, nome_loja, email, senha } = req.body;

    if (!nome) {
        return res.status(400).json('O campo nome é obrigatório');
    };
    if (!nome_loja) {
        return res.status(400).json('O campo nome_loja é obrigatório');
    };
    if (!email) {
        return res.status(400).json('O campo email é obrigatório');
    };
    if (!senha) {
        return res.status(400).json('O campo senha é obrigatório');
    };

    try {
        const queryConsultaEmail = 'select * from usuarios where email = $1';
        const { rowCount: quantidadeUsuarios } = await conexao.query(queryConsultaEmail, [email]);

        if (quantidadeUsuarios > 0) {
            return res.status(400).json({
                mensagem: 'O email informado já existe.'
            });
        };

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const query = 'insert into usuarios (nome, nome_loja, email, senha) values ($1, $2, $3, $4)';
        const usuarioCadastrado = await conexao.query(query, [nome, nome_loja, email, senhaCriptografada]);

        if (usuarioCadastrado.rowCount === 0) {
            return res.status(404).json({
                mensagem: 'Não foi possível cadastrar o usuário.'
            });
        };

        return res.status(204).json();
    } catch (error) {
        return res.status(404).json(error.message);
    }
};

const detalharUsuario = (req, res) => {
    const { usuario } = req;

    try {
        return res.status(200).json(usuario);
    } catch (error) {
        return res.status(404).json(error.message);
    };
};

const atualizarUsuario = async (req, res) => {
    const { usuario } = req;
    const { nome, nome_loja, email, senha } = req.body;

    if (!nome) {
        return res.status(400).json('O campo nome é obrigatório');
    };
    if (!nome_loja) {
        return res.status(400).json('O campo nome_loja é obrigatório');
    };
    if (!email) {
        return res.status(400).json('O campo email é obrigatório');
    };
    if (!senha) {
        return res.status(400).json('O campo senha é obrigatório');
    };

    try {
        if (usuario.email !== email) {
            const queryConsultaEmail = 'select * from usuarios where email = $1';
            const { rowCount: quantidadeUsuarios } = await conexao.query(queryConsultaEmail, [email]);

            if (quantidadeUsuarios > 0) {
                return res.status(400).json({
                    mensagem: 'O email informado já está em uso.'
                });
            };
        };

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const query = 'update usuarios set nome = $1, nome_loja = $2, email = $3, senha = $4 where id = $5';
        const usuarioCadastrado = await conexao.query(query, [nome, nome_loja, email, senhaCriptografada, usuario.id]);

        if (usuarioCadastrado.rowCount === 0) {
            return res.status(404).json({
                mensagem: 'Não foi possível atualizar o usuário.'
            });
        };

        return res.status(204).json();
    } catch (error) {
        return res.status(404).json(error.message);
    };
};

module.exports = {
    cadastrarUsuario,
    detalharUsuario,
    atualizarUsuario
};