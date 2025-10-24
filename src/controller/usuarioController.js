import * as repo from '../repository/usuarioRepository.js';
import { generateToken } from '../utils/jwt.js';
import { Router } from "express";

const endpoints = Router();

endpoints.post('/login/conta', async (req, resp) => {
  try {
    let novaConta = req.body;
    let id = await repo.criarConta(novaConta);
    resp.send({ novoId: id });
  } catch (error) {
    resp.status(500).send({ erro: 'Ocorreu um erro!' });
  }
});

endpoints.post('/login', async (req, resp) => {
  try {
    const { email, senha } = req.body;
    const usuario = await repo.login(email, senha);

    if (!usuario) {
      return resp.status(401).send({ erro: 'Credenciais inválidas' });
    }

    const token = generateToken({ id: usuario.id_usuario, nome: usuario.nome });
    resp.send({ token });
  } catch (error) {
    resp.status(500).send({ erro: 'Ocorreu um erro!' });
  }
});

export default endpoints;