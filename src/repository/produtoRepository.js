import { connection } from './connection.js';

export async function criarProduto(produto) {
  const comando = `
    INSERT INTO produto (nome, preco, descricao, disponivel, data_postagem, imagem, id_usuario)
                 VALUES (?, ?, ?, ?, ?, ?, ?);
  `;
  const [info] = await connection.query(comando, [
    produto.nome,
    produto.preco,
    produto.descricao,
    true,
    new Date(),
    produto.imagem,
    produto.id_usuario
  ]);
  return info.insertId;
}

export async function listarProdutos(nome, precoMin, precoMax) {
  let comando = `
    SELECT * FROM produto WHERE disponivel = true
  `;
  let params = [];

  if (nome) {
    comando += ' AND nome LIKE ?';
    params.push(`%${nome}%`);
  }

  if (precoMin && precoMax) {
    comando += ' AND preco BETWEEN ? AND ?';
    params.push(precoMin, precoMax);
  }

  const [produtos] = await connection.query(comando, params);
  return produtos;
}

export async function listarProdutosUsuario(id_usuario) {
  const comando = `
    SELECT * FROM produto WHERE id_usuario = ?
  `;
  const [produtos] = await connection.query(comando, [id_usuario]);
  return produtos;
}

export async function alterarProduto(id, produto, id_usuario) {
  const comando = `
    UPDATE produto
       SET nome = ?, preco = ?, descricao = ?
     WHERE id_produto = ? AND id_usuario = ?
  `;
  const [info] = await connection.query(comando, [
    produto.nome,
    produto.preco,
    produto.descricao,
    id,
    id_usuario
  ]);
  return info.affectedRows;
}

export async function excluirProduto(id, id_usuario) {
  const comando = `
    DELETE FROM produto WHERE id_produto = ? AND id_usuario = ?
  `;
  const [info] = await connection.query(comando, [id, id_usuario]);
  return info.affectedRows;
}

export async function indisponibilizarProduto(id_produto) {
    const comando = `
        UPDATE produto
           SET disponivel = false
         WHERE id_produto = ?
    `;
    const [info] = await connection.query(comando, [id_produto]);
    return info.affectedRows;
}