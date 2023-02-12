import bcrypt from 'bcryptjs';
import jwt, {VerifyOptions} from 'jsonwebtoken';
import fs from 'fs';

const privateKey = fs.readFileSync('./keys/private.key', 'utf-8');
const publicKey = fs.readFileSync('./keys/public.key', 'utf-8');
const jwtExpires = parseInt(`${process.env.JWT_EXPIRES}`);
const jwtalgorithm = 'RS256';

function hashPassword(password: string){
    return bcrypt.hashSync(password, 10);
}

function comparePassword(password: string, hashPassword: string){
    return bcrypt.compareSync(password, hashPassword);
}

type Token = {id: number};
 
function sign(id: number){
    const token: Token = {id};
    return jwt.sign(token, privateKey, {expiresIn: jwtExpires, algorithm: jwtalgorithm});
}

async function verify(token: string){
    try {
        //decoded é id
        const tokenDecoded: Token = await jwt.verify(token, publicKey, {algotithm: [jwtalgorithm]} as VerifyOptions) as Token;
        return {id: tokenDecoded.id}
    } catch (error) {
        console.log(`verify: ${error}`);
        return null;
    }
}

export default{hashPassword, comparePassword, sign, verify}