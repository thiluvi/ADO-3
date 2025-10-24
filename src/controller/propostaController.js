import * as repo from '../repository/propostaRepository.js';
import * as produtoRepo from '../repository/produtoRepository.js';
import { getAuthentication } from '../utils/jwt.js';
import { Router } from "express";

const endpoints = Router();

endpoints.post('/proposta', getAuthentication(), async (req, resp) => {
  try {
    let proposta = req.body;
    proposta.id_usuario = req.user.id;
    const id = await repo.criarProposta(proposta);
    resp.send({ id });
  } catch (error) {
    resp.status(500).send({ erro: 'Ocorreu um erro!' });
  }
});

endpoints.put('/proposta/:id/aceitar', getAuthentication(), async (req, resp) => {
  try {
    const { id } = req.params;
    const id_usuario = req.user.id;
    
    const proposta = await repo.buscarPropostaPorId(id);
    if (!proposta) {
        return resp.status(404).send({ erro: 'Proposta não encontrada.'});
    }

    const produto = await produtoRepo.listarProdutosUsuario(id_usuario);
    if (!produto.find(p => p.id_produto === proposta.id_produto)) {
        return resp.status(403).send({ erro: 'Você não tem permissão para aceitar esta proposta.'});
    }

    await repo.aceitarProposta(id);
    await produtoRepo.indisponibilizarProduto(proposta.id_produto);
    
    resp.status(204).send();
  } catch (error) {
    resp.status(500).send({ erro: 'Ocorreu um erro!' });
  }
});

endpoints.put('/proposta/:id/rejeitar', getAuthentication(), async (req, resp) => {
  try {
    const { id } = req.params;
    const id_usuario = req.user.id;

    const proposta = await repo.buscarPropostaPorId(id);
    if (!proposta) {
        return resp.status(404).send({ erro: 'Proposta não encontrada.'});
    }

    const produto = await produtoRepo.listarProdutosUsuario(id_usuario);
    if (!produto.find(p => p.id_produto === proposta.id_produto)) {
        return resp.status(403).send({ erro: 'Você não tem permissão para rejeitar esta proposta.'});
    }
    
    await repo.rejeitarProposta(id);
    resp.status(204).send();
  } catch (error) {
    resp.status(500).send({ erro: 'Ocorreu um erro!' });
  }
});

endpoints.get('/produto/:id/propostas', getAuthentication(), async (req, resp) => {
    try {
        const { id } = req.params;
        const id_usuario = req.user.id;
        
        const produto = await produtoRepo.listarProdutosUsuario(id_usuario);
        if (!produto.find(p => p.id_produto == id)) {
            return resp.status(403).send({ erro: 'Você não tem permissão para ver as propostas deste produto.'});
        }

        const propostas = await repo.listarPropostasPorProduto(id);
        resp.send(propostas);
    } catch (error) {
        resp.status(500).send({ erro: 'Ocorreu um erro!' });
    }
});


export default endpoints;