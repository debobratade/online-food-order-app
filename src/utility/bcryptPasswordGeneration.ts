import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { vandorPayload } from '../dto';
import { JWT_SECRET } from '../config';
import { Request } from 'express';
import { AuthPayload } from '../dto/auth.dto';

export const generateSalt = async () => {
    return await bcrypt.genSalt()
}

export const generatePassword = async (password: string, salt: string) => {
    return bcrypt.hash(password, salt)
}

export const validatePassword = async (enterPassword: string, savepassword: string, salt: string) => {
    return await generatePassword(enterPassword, salt) === savepassword
}

export const generateSignature = async (payload: AuthPayload) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' })
}

export const validateSignature = async (req: Request) => {
    const signature = req.get('Authorization')

    if (signature) {
        try {
            const payload = await jwt.verify(signature.split(' ')[1], JWT_SECRET) as AuthPayload
            req.user = payload
            return true
        } catch (error:any) {
            // Handle the error, for example log it
            console.error("JWT verification failed:", error.message);
            return false;
        }
    }
    return false
}
