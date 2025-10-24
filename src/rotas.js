import produtoController from "./controller/produtoController.js";
import propostaController from "./controller/propostaController.js";
import usuarioController from "./controller/usuarioController.js";

export function adicionarRotas(api){
    api.use(produtoController);
    api.use(propostaController);
    api.use(usuarioController);
}