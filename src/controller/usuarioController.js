import * as repo from '../repository/usuarioRepository.js';

import { generateToken } from '../utils/jwt.js'

import { Router } from "express";
const endpoints = Router();


endpoints.post('/login/conta', async (req, resp) => {
  let novaConta = req.body;

  let id = await repo.criarConta(novaConta);
  resp.send({ novoId: id });
})

export default endpoints;