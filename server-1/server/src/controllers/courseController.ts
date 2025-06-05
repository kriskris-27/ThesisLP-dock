 import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import StructuredDoc from '../models/StructuredDoc';

// Get all available courses for students
export const getAvailableCourses = async (req: AuthRequest, res: Response) => {
    try {
        // Get all documents that are marked as published/available
        const courses = await StructuredDoc.find()
            .select('courseTitle createdAt updatedAt') // Only get necessary fields for list view
            .sort({ createdAt: -1 }) // Most recent first
            .lean(); // Convert to plain JavaScript object for better performance

        res.status(200).json({
            message: 'Courses retrieved successfully',
            data: courses,
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        console.error('Get courses error:', error);
        
        res.status(500).json({
            message: 'Failed to retrieve courses',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
};

// Get a single course for student view
export const getCourse = async (req: AuthRequest, res: Response) => {
    const { courseId } = req.params;

    try {
        const course = await StructuredDoc.findById(courseId)
            .select('-__v') // Exclude version field
            .lean();

        if (!course) {
            return res.status(404).json({
                message: 'Course not found',
                timestamp: new Date().toISOString()
            });
        }

        res.status(200).json({
            message: 'Course retrieved successfully',
            data: course,
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        console.error('Get course error:', error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({
                message: 'Invalid course ID',
                timestamp: new Date().toISOString()
            });
        }

        res.status(500).json({
            message: 'Failed to retrieve course',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
};

// Get course progress (to be implemented when we add progress tracking)
export const getCourseProgress = async (req: AuthRequest, res: Response) => {
    const { courseId } = req.params;
    const userId = req.user?._id;

    if (!userId) {
        return res.status(401).json({
            message: 'Unauthorized',
            timestamp: new Date().toISOString()
        });
    }

    try {
        // This is a placeholder for future progress tracking implementation
        res.status(200).json({
            message: 'Course progress retrieved successfully',
            data: {
                courseId,
                userId,
                lastAccessedModule: 0,
                lastAccessedLesson: 0,
                completedLessons: [],
                progress: 0
            },
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        console.error('Get course progress error:', error);
        
        res.status(500).json({
            message: 'Failed to retrieve course progress',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
};