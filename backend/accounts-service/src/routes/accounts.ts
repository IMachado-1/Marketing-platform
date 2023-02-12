import { Router} from "express";
import accountsController from '../controllers/accounts';
import {validateAccountSchema, validadeLoginSchema, validateUpdatedAccount, validadeAuth} from "./middlewares";
const router = Router();

//Pesquisar sobre refresh token!
router.get('/accounts/', validadeAuth, accountsController.getAccounts);
router.get('/accounts/:id',validadeAuth, accountsController.getAccount);
router.patch('/accounts/:id',validadeAuth, validateUpdatedAccount, accountsController.setAccount); //Verificar validateUpdatedAccount, pois só atualiza informando todos atributos do schema 
//Verificar forma de evitar ataques de robo para criação de conta
router.post('/accounts/',validateAccountSchema, accountsController.addAccount);
//Futuramente extrair parte de autenticação para um micro serviço especifico ou serviço numem(google firebase, SSO da Amazom)
router.post('/accounts/login', validadeLoginSchema, accountsController.loginAccount);
router.post('/accounts/logout', accountsController.logoutAccount); // não validadeAuth, por enquanto.

export default router;