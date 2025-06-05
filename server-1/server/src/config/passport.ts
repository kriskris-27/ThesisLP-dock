import passport from "passport";
import dotenv from 'dotenv';
dotenv.config();
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from '../models/User';

passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!
    }
    ,
      async(_accessToken,_refreshToken,profile,done)=>{
        try{
            const existingUser= await User.findOne({googleId:profile.id})

            if(existingUser){
                return done(null,existingUser);
            }
            const newUser = new User({
                googleId:profile.id,
                email:profile.emails?.[0].value,
                name:profile.displayName,
                role:'student'
            });
            await newUser.save();
            done(null,newUser);
        }
        catch(err){
            done(err,undefined)
        }
      }))