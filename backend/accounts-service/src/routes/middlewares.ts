import { Router, Request, Response } from "express";
import joi from 'joi';
import { accountSchema, loginSchema, accountUpdateSchema } from "../models/accountSchemas";
import auth from '../auth';

function validateSchema(schema: joi.ObjectSchema<any> ,req: Request, res: Response, next: any): any{
    const {error} = schema.validate(req.body); //valida se body é correspondente ao Schema
    if(error == null) return next(); // se erro = null executa a proxima funbção e pula códigos abaixo
    //Se não 
    const {details} = error;
    const message = details.map(item => item.message).join(',');

    console.log(`validateSchema: ${message}`)
    res.status(422).end();
};

function validateAccountSchema(req: Request, res: Response, next: any){
    return validateSchema(accountSchema, req, res, next);  
};

function validateUpdatedAccount(req: Request, res: Response, next: any){
    return validateSchema(accountUpdateSchema, req, res, next);  
};

function validadeLoginSchema(req: Request, res: Response, next: any){
    return validateSchema(loginSchema, req, res, next);    
};

//Middlewares de Auth 
async function validadeAuth(req: Request, res: Response, next: any){
    try {
        const token = req.headers['x-access-token'] as string;
        if(!token){
            return res.status(401).end();
        } else{
            const payload = await auth.verify(token); //verifica se token é valido
            if(!payload){
                return res.status(401).end();
            }else{
                res.locals.payload = payload;
                next();
            }
        }
    } catch (error) {
        console.log(`validadeAuth: ${error}`);
        res.status(400).end();
    }
}


export {validateAccountSchema, validadeLoginSchema, validateUpdatedAccount, validadeAuth}

//Futuramente incluir middlewares para autenticação.