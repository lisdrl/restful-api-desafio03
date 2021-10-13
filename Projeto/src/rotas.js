const express = require('express');
const usuario = require('./controladores/usuario');
const login = require('./controladores/login');
const verificaLogin = require('./filtros/verificaLogin');
const produtos = require('./controladores/produtos');

const rotas = express();

// cadastrar usuario
rotas.post('/usuario', usuario.cadastrarUsuario);

// login
rotas.post('/login', login.login);

// verifica login
rotas.use(verificaLogin);

// usuario
rotas.get('/usuario', usuario.detalharUsuario);
rotas.put('/usuario', usuario.atualizarUsuario);

// produtos
rotas.get('/produtos', produtos.listarProdutos);
rotas.get('/produtos/:id', produtos.detalharProduto);
rotas.post('/produtos', produtos.cadastrarProdutos);
rotas.put('/produtos/:id', produtos.atualizarProduto);
rotas.delete('/produtos/:id', produtos.excluirProduto);

module.exports = rotas;
