const conexao = require('../conexao');

const listarProdutos = async (req, res) => {
    const { usuario } = req;

    try {
        const query = 'select * from produtos where usuario_id = $1';
        const { rows: produtos } = await conexao.query(query, [usuario.id]);

        return res.status(200).json(produtos);
    } catch (error) {
        return res.status(404).json(error.message);
    };
};

const detalharProduto = async (req, res) => {
    const { usuario } = req;
    const idProduto = req.params.id;

    try {
        const query = 'select * from produtos where id = $1';
        const { rows: produto } = await conexao.query(query, [idProduto]);

        if (produto.length === 0) {
            return res.status(404).json({
                mensagem: `Não existe produto cadastrado com ID ${idProduto}.`
            });
        }

        if (produto[0].usuario_id !== usuario.id) {
            console.log("userID", usuario.id)
            console.log("userID retornado", produto.usuario_id)

            return res.status(403).json({
                mensagem: "O usuário logado não tem permissão para acessar este produto."
            });
        };

        return res.status(200).json(produto);
    } catch (error) {
        return res.status(404).json(error.message);
    };

};

const cadastrarProdutos = async (req, res) => {
    const { usuario } = req;
    const { nome, quantidade, categoria, preco, descricao, imagem } = req.body;

    if (!nome || !quantidade || !preco || !descricao) {
        return res.status(400).json({
            mensagem: 'Os campos nome, quantidade, preco e descricao são obrigatórios.'
        });
    };

    if (quantidade <= 0) {
        return res.status(400).json({
            mensagem: 'A quantidade deve ser maior que 0.'
        });
    };

    try {
        const query = 'insert into produtos (nome, quantidade, categoria, preco, descricao, imagem, usuario_id) values ($1, $2, $3, $4, $5, $6, $7)';
        const produtoCadastrado = await conexao.query(query, [nome, quantidade, categoria, preco, descricao, imagem, usuario.id]);

        if (produtoCadastrado.rowCount === 0) {
            return res.status(404).json({
                mensagem: 'Não foi possível cadastrar o produto.'
            });
        };

        return res.status(204).json();
    } catch (error) {
        return res.status(404).json(error.message);
    }

};

const atualizarProduto = async (req, res) => {
    const { usuario } = req;
    const idProduto = req.params.id;
    const { nome, quantidade, preco, descricao } = req.body;

    if (!nome) {
        return res.status(400).json('O campo nome é obrigatório.');
    };
    if (!quantidade || quantidade === 0) {
        return res.status(400).json('O campo quantidade é obrigatório  e deve ser um número válido.');
    };
    if (!preco || preco <= 0) {
        return res.status(400).json('O campo preco é obrigatório e deve ser um número válido.');
    };
    if (!descricao) {
        return res.status(400).json('O campo descricao é obrigatório.');
    };

    try {
        const query = 'select * from produtos where id = $1';
        const { rows: produto } = await conexao.query(query, [idProduto]);

        if (produto.length === 0) {
            return res.status(404).json({
                mensagem: `Não existe produto cadastrado com ID ${idProduto}.`
            });
        };

        if (produto[0].usuario_id !== usuario.id) {
            console.log("userID", usuario.id)
            console.log("userID retornado", produto[0].usuario_id)

            return res.status(403).json({
                mensagem: "O usuário logado não tem permissão para acessar este produto."
            });

        };

        const queryUpdate = 'update produtos set nome = $1, quantidade = $2, preco = $3, descricao = $4 where id = $5';
        const produtoAtualizado = await conexao.query(queryUpdate, [nome, quantidade, preco, descricao, idProduto]);
        console.log(produtoAtualizado)

        if (produtoAtualizado.rowCount === 0) {
            return res.status(404).json('Não foi possível alterar o produto.');
        };

        return res.status(204).json();
    } catch (error) {
        return res.status(404).json(error.message);
    }
};

const excluirProduto = async (req, res) => {
    const { usuario } = req;
    const idProduto = req.params.id;

    try {
        const query = 'select * from produtos where id = $1';
        const { rows: produto } = await conexao.query(query, [idProduto]);

        if (produto.length === 0) {
            return res.status(404).json({
                mensagem: `Não existe produto cadastrado com ID ${idProduto}.`
            });
        }

        if (produto[0].usuario_id !== usuario.id) {
            console.log("userID", usuario.id)
            console.log("userID retornado", produto.usuario_id)

            return res.status(403).json({
                mensagem: "O usuário logado não tem permissão para acessar este produto."
            });
        };

        const queryDelete = 'delete from produtos where id = $1';
        const { rows: produtoDeletado } = await conexao.query(queryDelete, [idProduto]);

        if (produtoDeletado.rowCount === 0) {
            return res.status(404).json('Não foi possível excluir o produto.');
        };

        return res.status(200).json();
    } catch (error) {
        return res.status(404).json(error.message);
    };
};

module.exports = {
    listarProdutos,
    detalharProduto,
    cadastrarProdutos,
    atualizarProduto,
    excluirProduto
};