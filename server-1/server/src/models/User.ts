import mongoose,{Document,Schema} from "mongoose";

export interface IUser extends Document{
    email:string;
    password?:string;
    name:string;
    role:'student' | 'admin';
    googleId?:string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String },
    name: { type: String, required: true },
    role: { type: String, enum: ['student', 'admin'], default: 'student' },
    googleId: { type: String },
}, { timestamps: true });


export default mongoose.model<IUser>('User',UserSchema);