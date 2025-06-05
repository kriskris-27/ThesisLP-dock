import { Request,Response,NextFunction } from "express";
import  jwt  from "jsonwebtoken";
import User from "../models/User";
import { RequestHandler } from "express";

const JWT_SECRET =  process.env.JWT_SECRET!;

export interface AuthRequest extends Request{
    user?:any
}

export const authenticateUser: RequestHandler = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    const token = req.cookies.accessToken; 

    if (!token) {
        res.status(401).json({ message: 'No token provided (cookie authmiddleware X)' });
        return;
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as {id: string; role: string};
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            res.status(401).json({message: 'Invalid Token (auth)(userX)'});
            return;
        }
        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({message: 'Token verification failed(auth)'});
    }
};

export const authorizeRoles = (...roles: string[]): RequestHandler => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403).json({ message: 'Forbidden: insufficient permission' });
            return;
        }
        next();
    };
};