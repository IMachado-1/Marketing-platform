import accountModel, {IaccountModel} from './accountModel';
import {IAccount} from './account';
import { DestroyOptions } from 'sequelize';

//(funções assincrona) usar generics <AccountModel> expressa explicitamente que o findAll usa a interface accountModel e durante o desenvolvimento concede autocomplete de seus atributos 
function findAll(){
    return accountModel.findAll<IaccountModel>();
};    

function findById(id: number){
    return accountModel.findByPk<IaccountModel>(id);
};

//quando campo é unique podemos usar findOne
function findByEmail(emailFilter: string){
    return accountModel.findOne<IaccountModel>({where: {email: emailFilter}});
};


function add(account: IAccount){
    return accountModel.create(account);
};
async function set(id: number, account: IAccount){
    const originalAccount = await accountModel.findByPk<IaccountModel>(id);
    if(originalAccount !== null){
        if(account.name)
            originalAccount.name = account.name;
        if(account.domain)
            originalAccount.domain = account.domain;
        if(account.status)
            originalAccount.status = account.status;
        if(account.password)
            originalAccount.password = account.password;
        return originalAccount.save();
    }
    return null;
}
    
async function remove (id:number) {
    return accountModel.destroy({where: {id: id}} as DestroyOptions<IAccount>)
}

async function removeByEmail (email: string) {
    return accountModel.destroy({where: {email: email}} as DestroyOptions<IAccount>)
}

export default { findAll, findById, add, set, findByEmail, remove, removeByEmail}