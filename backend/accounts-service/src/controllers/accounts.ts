import {Request, Response} from 'express'; 
import {IAccount} from '../models/account';
import repository from '../models/accountRepository'; //Repository funções (assincronas)
import auth from '../auth'; //Futuramente criar um middlware para autenticações

async function getAccounts(req: Request, res: Response, next: any){
    const accounts = await repository.findAll();

    res.json(accounts.map(item => { //zerando as senhas
        item.password = '';
        return item;
    }));
}

async function getAccount(req: Request, res: Response, next: any){
    try {
        const id = parseInt(req.params.id);
        if(!id){  
            throw new Error("ID is invalid format");
        }

        const account = await repository.findById(id);
        if (account === null) {
            return res.status(404).end();
        } else {
            account.password = '';
            return res.json(account);
        } 
    } catch (error) {
        console.log(`getAccount ${error}`);
        res.status(400).end();
    }
}

async function addAccount(req: Request, res: Response, next: any){
    //Futuramente configurar front para rodar com criptografia via TLS.
    try {
    // Futuramente incluir verificação de e-mail existente
    // Interface habilita autocomplete
        const newAccount = req.body as IAccount;
        newAccount.password = auth.hashPassword(newAccount.password);
        const result = await repository.add(newAccount);
        newAccount.password = '';
        newAccount.id = result.id;
        res.status(201).json(newAccount);
    } catch (error) {
        console.log(error);
        res.status(400).end;
    }
}
    
//Função ainda obrigada name, email, pass e domain como parametro
async function setAccount(req: Request, res: Response, next: any){
    try {
        const id = parseInt(req.params.id);
        if(!id) throw new Error('ID is invalid format.');//Retorna Sslicitação incorreta 400
        
        const accountParams = req.body as IAccount;
        
        if(accountParams.password){
            accountParams.password = auth.hashPassword(accountParams.password);
        }else{
            const updatedAccount = await repository.set(id, accountParams);
            if(updatedAccount !== null){
                updatedAccount.password = '';
                res.status(200).json(updatedAccount);
            }else{
                res.status(404).end();
            }
        }
    } catch (error) {
        console.log(error);
        res.status(400).end();
    }
}

async function loginAccount(req: Request, res: Response, next: any){
    try {
        const loginParams = req.body as IAccount;
        const account = await repository.findByEmail(loginParams.email);
       // console.log(`loginAccount: ${JSON.stringify(account)}`);
        if(account !== null){
            const isValid = auth.comparePassword(loginParams.password, account.password);
            if(isValid){
                const token = await auth.sign(account.id!);
                return res.json({auth: true, token})
            }
        }
            return res.status(401).end();
    } catch (error) {
        console.log(error);
        res.status(400).end();
    }
}

function logoutAccount(req: Request, res: Response, next: any){
    //verificar possibilidade de blacklist de tokens e exclusão de cokies no front
    res.json({auth: false, token: null});
}

export default {getAccounts, getAccount, addAccount, setAccount, loginAccount, logoutAccount}