import { AccountStatus } from './accountStatus';

//Garantir os tipos e autcomplete durante a escrita
export interface IAccount{
    id?: number, //interrogação quer dizer opcional
    name: string,
    email: string,
    password: string,
    status?: AccountStatus,
    domain: string
};