import mongoose, { Document, Schema } from 'mongoose';

interface Lesson {
    title: string;
    content: string;
    example?: string;
}

interface Module {
    moduleTitle: string;
    lessons: Lesson[];
}

export interface IStructuredDoc extends Document {
    courseTitle: string;
    modules: Module[];
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const LessonSchema = new Schema<Lesson>({
    title: { type: String, required: true },
    content: { type: String, required: true },
    example: { type: String }
});

const ModuleSchema = new Schema<Module>({
    moduleTitle: { type: String, required: true },
    lessons: [LessonSchema]
});

const StructuredDocSchema = new Schema<IStructuredDoc>({
    courseTitle: { type: String, required: true },
    modules: [ModuleSchema],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.model<IStructuredDoc>('StructuredDoc', StructuredDocSchema); 