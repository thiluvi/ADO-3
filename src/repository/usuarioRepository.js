import { connection } from './connection.js';


export async function criarConta(novaConta) {
  const comando = `
    INSERT INTO usuario (nome, email, senha, nome_usuario, data_criacao)
               VALUES (?, ?, MD5(?), ?, ?);
  `;

  const [info] = await conection.query(comando, [
    novaConta.nome,
    novaConta.email,
    novaConta.senha,
    novaConta.nome_usuario,
    new Date()
  ]);
  return info.insertId;
}