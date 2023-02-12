//Testes relativos a rotas de autenticação.
import { afterAll, beforeAll, expect, describe, it} from '@jest/globals';
//import { afterEach, beforeEach } from 'node:test';
import request from 'supertest';
import app from '../src/app';
import { IAccount } from '../src/models/account';
import repository from '../src/models/accountRepository';

const testEmail = 'jest@jest.com';
const testPassword = '123456';
const hashPassword = '$2a$10$cpNI43Xt5rNA6hSUjhPq6O6E2636U8fAokqnevVO6yAXhj4mNb7gO';

beforeAll(async () =>{
    const testAccount : IAccount = {
        name: 'jest',
        email: testEmail,
        password: hashPassword,
        domain: 'jest.com'
    }
    await repository.add(testAccount);
});

afterAll(async () =>{
    const account = await repository.removeByEmail(testEmail);
});

describe('Testando rotas de autenticação', () =>{
    
    it('POST /accounts/login - 200 OK', async () =>{
        //testing
        const payload ={
            email: testEmail,
            password: testPassword
        }

        const resultado = await request(app)
            .post('/accounts/login')
            .send(payload);

        expect(resultado.status).toEqual(200);
        expect(resultado.body.auth).toBeTruthy();
        expect(resultado.body.token).toBeTruthy();
    })

    it('POST /accounts/login - 401 Unauthorized', async () =>{
        const payload ={
            email: testEmail,
            password: '8564321' //Senha errada
        }
    
        const resultado = await request(app)
            .post('/accounts/login')
            .send(payload);
    
        expect(resultado.status).toEqual(401);
    })

    it('POST /accounts/login - 422 Unprocessable entity', async () =>{
        const payload ={
            email: testEmail,
            //Tentativa de login descumprindo regras de loginSchema
        }
    
        const resultado = await request(app)
            .post('/accounts/login')
            .send(payload);
    
        expect(resultado.status).toEqual(422);
    })

    it('POST /accounts/logout - Deve retornar statusCode 200', async () =>{
        
        const resultado = await request(app)
            .post('/accounts/logout')
          
        expect(resultado.status).toEqual(200);
    })
})