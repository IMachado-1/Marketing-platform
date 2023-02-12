//definição da tabela de bd
import Sequelize, {Model, Optional} from 'sequelize';
import database from 'mp-commons/data/db' ; //importando objeto sequelize como database
import {IAccount} from './account';

//AccountCreationAttributes são os campos opcionais para insert
interface IaccountCreationAttributes extends Optional<IAccount, "id">{}

//Devo extender classe Model para informar o type corresponte na minha aplicação(IAccount) 
//e os atributos que serão opcionais em casos de insert
export interface IaccountModel extends Model<IAccount, IaccountCreationAttributes>, IAccount{}

//Definir o schema que siga as regras da interface
//Utilizar o AccountModel como generics para definir que a minha tabela siga as regras da interface IAccount e AccountCreationAttributes
const Account = database.define<IaccountModel>('account', {    
    id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    status: {
        type: Sequelize.SMALLINT.UNSIGNED,
        allowNull: false,
        defaultValue: 100
    },
    domain: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

export default Account;