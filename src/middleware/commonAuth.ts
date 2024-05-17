import { AuthPayload } from "../dto/auth.dto";
import { NextFunction, Request, Response } from "express";
import { validateSignature } from "../utility";

declare global {
    namespace Express {
        interface Request {
            user?: AuthPayload
        }
    }
}           


export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const validate = await validateSignature(req)
    if (validate==true) {
        next()
    } else {
        return res.status(401).json({ 'message': 'authentication fail!' })
    }
}