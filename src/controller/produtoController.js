import * as repo from '../repository/produtoRepository.js';
import { getAuthentication } from '../utils/jwt.js';
import { Router } from "express";
import multer from 'multer';

const endpoints = Router();
const upload = multer({ dest: 'uploads/' });

endpoints.post('/produto', getAuthentication(), upload.single('imagem'), async (req, resp) => {
  try {
    let produto = req.body;
    produto.id_usuario = req.user.id;
    if (req.file) {
      produto.imagem = req.file.path;
    }
    const id = await repo.criarProduto(produto);
    resp.send({ id });
  } catch (error) {
    resp.status(500).send({ erro: 'Ocorreu um erro!' });
  }
});

endpoints.get('/produtos', async (req, resp) => {
  try {
    const { nome, precoMin, precoMax } = req.query;
    const produtos = await repo.listarProdutos(nome, precoMin, precoMax);
    resp.send(produtos);
  } catch (error) {
    resp.status(500).send({ erro: 'Ocorreu um erro!' });
  }
});

endpoints.get('/usuario/produtos', getAuthentication(), async (req, resp) => {
  try {
    const id_usuario = req.user.id;
    const produtos = await repo.listarProdutosUsuario(id_usuario);
    resp.send(produtos);
  } catch (error) {
    resp.status(500).send({ erro: 'Ocorreu um erro!' });
  }
});

endpoints.put('/produto/:id', getAuthentication(), async (req, resp) => {
  try {
    const { id } = req.params;
    const produto = req.body;
    const id_usuario = req.user.id;

    const rowsAffected = await repo.alterarProduto(id, produto, id_usuario);
    if (rowsAffected === 0) {
      return resp.status(404).send({ erro: 'Produto não encontrado ou você não tem permissão para alterá-lo.' });
    }
    resp.status(204).send();
  } catch (error) {
    resp.status(500).send({ erro: 'Ocorreu um erro!' });
  }
});

endpoints.delete('/produto/:id', getAuthentication(), async (req, resp) => {
  try {
    const { id } = req.params;
    const id_usuario = req.user.id;
    const rowsAffected = await repo.excluirProduto(id, id_usuario);

    if (rowsAffected === 0) {
      return resp.status(404).send({ erro: 'Produto não encontrado ou você não tem permissão para excluí-lo.' });
    }
    resp.status(204).send();
  } catch (error) {
    resp.status(500).send({ erro: 'Ocorreu um erro!' });
  }
});

export default endpoints;