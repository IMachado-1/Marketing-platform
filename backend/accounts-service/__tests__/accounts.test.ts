import {beforeAll, afterAll, expect, describe, it} from '@jest/globals';
import request from 'supertest';
import { IAccount } from '../src/models/account';
import app from './../src/app';
import repository from '../src/models/accountRepository';
import auth from '../src/auth';

const testEmail = 'jest@jest.com';
const testEmail2 = 'jest2@jest.com';
const hashPassword = '$2a$10$cpNI43Xt5rNA6hSUjhPq6O6E2636U8fAokqnevVO6yAXhj4mNb7gO';
const testDomain = 'jest.com';
let jwt: string = '';
let testId: number = 0;

beforeAll(async () =>{
    const testAccount : IAccount = {
        name: 'jest',
        email: testEmail,
        password: hashPassword,
        domain: testDomain
    }
    const result = await repository.add(testAccount);
    testId = result.id!;
    jwt = await auth.sign(result.id!);
    
});

afterAll(async () =>{
    await repository.removeByEmail(testEmail);
    await repository.removeByEmail(testEmail2);
});

//Temos a opção de modularizar os testes por responsabilidade ou tipos de verbos
describe('Testando rotas accounts', () =>{
    
    it('GET /accounts/ Deve retornar statuscode 200', async() =>{
        const resultado = await request(app)
        .get('/accounts/')
        .set('x-access-token', jwt); //Cabeçalho HTTP para transmissão de token

        expect(resultado.status).toEqual(200);

    })

    it('POST /accounts/ - Deve retornar statusCode 201', async () =>{
        const payload : IAccount = {
            name: "italo mm2",
            email: testEmail2,
            password: '123456',
            domain: testDomain,
        }

        const resultado = await request(app)
            .post('/accounts/')
            .send(payload);

        expect(resultado.status).toEqual(201);
        expect(resultado.body.id).toBeTruthy();
    })

    it('POST /accounts/ - Deve retornar statusCode 422', async () =>{
        const payload = {
            id: 1,
            street: 'Rua abc',
            city: 'Brasilândia',
            status: 1
        }

        const resultado = await request(app)
            .post('/accounts').send(payload);

        expect(resultado.status).toEqual(422);
    })

    it('PATCH /accounts/:id - Deve retornar statusCode 200', async () =>{
        const payload = {
            name: 'Italo',
        }

        const resultado = await request(app)
            .patch('/accounts/' + testId)
            .send(payload)
            .set('x-access-token', jwt);

        expect(resultado.status).toEqual(200);
        expect(resultado.body.name).toEqual(payload.name);
    })

    it('PATCH /accounts/:id - Deve retornar statusCode 400', async () =>{
        const payload = {
            name: 'Italo',
        }

        const resultado = await request(app)
            .patch('/accounts/texto').send(payload)//Solicitação incorreta
            .set('x-access-token', jwt);

        expect(resultado.status).toEqual(400);
    })

    it('PATCH /accounts/:id - Deve retornar statusCode 404', async () =>{
        const payload = {
            name: 'Italo'
        }

        const resultado = await request(app)
            .patch('/accounts/-1')
            .send(payload)
            .set('x-access-token', jwt);
            
        expect(resultado.status).toEqual(404);
    })

    it('GET /accounts/:id Deve retornar statuscode 200', async() =>{
        const resultado = await request(app)
        .get('/accounts/'+ testId)
        .set('x-access-token', jwt);

        expect(resultado.status).toEqual(200);
        expect(resultado.body.id).toBe(testId);
    })

    it('GET /accounts/:id Deve retornar status code 404', async() =>{
        const resultado = await request(app)
        .get('/accounts/-2')//Não é cadastrado
        .set('x-access-token', jwt);
        
        expect(resultado.status).toEqual(404);
    })

    it('GET /accounts/:id Deve retornar statuscode 400', async() =>{
        const resultado = await request(app)
        .get('/accounts/ABC')//id no parseInt
        .set('x-access-token', jwt);
       
        expect(resultado.status).toEqual(400);
    })
})