import  express, { RequestHandler }  from 'express';
import passport from 'passport';
import { signup,login, getMe, logout } from '../controllers/authController';
import { generateToken } from '../utils/jwt';
import { authenticateUser } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/signup', signup as RequestHandler);
router.post('/login', login as RequestHandler);
router.post('/logout', logout as unknown as RequestHandler)

router.get('/me', authenticateUser as RequestHandler, getMe)

router.get('/google',passport.authenticate('google',{scope:['profile','email']}));

router.get('/google/callback',
    passport.authenticate('google',{failureRedirect:'/login',session:false}),
    (req,res)=>{
        const user = req.user as any;
        const token = generateToken({id:user._id,role:user.role});

        // Set the token as a cookie
        res.cookie('accessToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.redirect(`${process.env.FRONTEND_ORIGIN || 'http://localhost:5173'}/oauth-success`);
    }
);


export default router;
