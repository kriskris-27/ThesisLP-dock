import  express  from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";
import passport from "passport";
import './config/passport';

import authRoutes from './routes/authRoutes';
import aiRoutes from './routes/aiRoutes';
import courseRoutes from './routes/courseRoutes';

// Load environment variables from the server directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  credentials: true, 
}));
app.use(cookieParser())
app.use(express.json())
app.use(passport.initialize());

app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/courses', courseRoutes);

app.get("/", (req,res)=>{
 res.send("Learning platform API is livee")
}) 

export default app;