CREATE DATABASE market_cubos;

DROP TABLE IF EXISTS usuarios;
CREATE TABLE usuarios (
  id serial primary key,
  nome text not null,
  nome_loja varchar(100) not null,
  email text not null,
  senha text not null
);

DROP TABLE IF EXISTS produtos;
CREATE TABLE produtos (
  id serial primary key,
  usuario_id integer not null,
  nome text not null,
  quantidade integer not null,
  categoria varchar(50),
  preco integer not null,
  descricao text not null,
  imagem text,
  foreign key (usuario_id) references usuarios (id)
);