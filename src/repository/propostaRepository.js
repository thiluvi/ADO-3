import { connection } from './connection.js';

export async function criarProposta(proposta) {
  const comando = `
    INSERT INTO proposta (valor, data_proposta, status_produto, id_produto, id_usuario)
                  VALUES (?, ?, ?, ?, ?);
  `;
  const [info] = await connection.query(comando, [
    proposta.valor,
    new Date(),
    'Pendente',
    proposta.id_produto,
    proposta.id_usuario
  ]);
  return info.insertId;
}

export async function buscarPropostaPorId(id) {
    const comando = `
        SELECT * FROM proposta WHERE id_proposta = ?
    `;
    const [propostas] = await connection.query(comando, [id]);
    return propostas[0];
}

export async function aceitarProposta(id) {
  const comando = `
    UPDATE proposta
       SET status_produto = 'Aceita'
     WHERE id_proposta = ?
  `;
  await connection.query(comando, [id]);
}

export async function rejeitarProposta(id) {
  const comando = `
    UPDATE proposta
       SET status_produto = 'Rejeitada'
     WHERE id_proposta = ?
  `;
  await connection.query(comando, [id]);
}

export async function listarPropostasPorProduto(id_produto) {
    const comando = `
        SELECT * FROM proposta WHERE id_produto = ?
    `;
    const [propostas] = await connection.query(comando, [id_produto]);
    return propostas;
}