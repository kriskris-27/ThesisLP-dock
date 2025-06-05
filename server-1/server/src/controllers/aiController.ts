// src/controllers/aiController.ts
import { Request, Response } from 'express';
import { callAimLapi } from '../utils/aiml';
import StructuredDoc from '../models/StructuredDoc';
import { AuthRequest } from '../middleware/authMiddleware';

export const structureDoc = async (req: AuthRequest, res: Response) => {
    const { rawText } = req.body;

    // Input validation
    if (!rawText || typeof rawText !== 'string' || rawText.trim().length < 10) {
        return res.status(400).json({
            message: 'Invalid input',
            details: 'Documentation text must be at least 10 characters long',
            timestamp: new Date().toISOString()
        });
    }

    try {
        console.log('Processing document structure request...');
        const aiResponse = await callAimLapi(rawText);
        
        // Parse the response (we know it's valid JSON from the utility function)
        const structuredDoc = JSON.parse(aiResponse);
        
        res.status(200).json({
            message: 'Document structured successfully',
            data: structuredDoc,
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        console.error('Document structuring error:', error);
        
        // Handle specific error types
        if (error.message.includes('not in valid JSON format')) {
            return res.status(500).json({
                message: 'Failed to structure document',
                details: 'AI response was not in the expected format',
                timestamp: new Date().toISOString()
            });
        }
        
        if (error.response?.status === 401) {
            return res.status(500).json({
                message: 'AI service authentication failed',
                details: 'Please check the API key configuration',
                timestamp: new Date().toISOString()
            });
        }
        
        if (error.response?.status === 429) {
            return res.status(429).json({
                message: 'AI service rate limit exceeded',
                details: 'Please try again in a few moments',
                timestamp: new Date().toISOString()
            });
        }

        res.status(500).json({
            message: 'Failed to structure document',
            error: error.message,
            details: error.response?.data,
            timestamp: new Date().toISOString()
        });
    }
};

export const saveDoc = async (req: AuthRequest, res: Response) => {
    const { structuredDoc } = req.body;
    const userId = req.user?._id;

    if (!userId) {
        return res.status(401).json({
            message: 'Unauthorized',
            timestamp: new Date().toISOString()
        });
    }

    // Input validation
    if (!structuredDoc || !structuredDoc.courseTitle || !Array.isArray(structuredDoc.modules)) {
        return res.status(400).json({
            message: 'Invalid input',
            details: 'Document structure is invalid',
            timestamp: new Date().toISOString()
        });
    }

    try {
        // Create new document
        const doc = new StructuredDoc({
            courseTitle: structuredDoc.courseTitle,
            modules: structuredDoc.modules,
            createdBy: userId
        });
        await doc.save();

        res.status(200).json({
            message: 'Document saved successfully',
            data: doc,
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        console.error('Document save error:', error);
        
        res.status(500).json({
            message: 'Failed to save document',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
};

// Add new endpoint to get all documents for a user
export const getUserDocs = async (req: AuthRequest, res: Response) => {
    const userId = req.user?._id;

    if (!userId) {
        return res.status(401).json({
            message: 'Unauthorized',
            timestamp: new Date().toISOString()
        });
    }

    try {
        const docs = await StructuredDoc.find({ createdBy: userId })
            .sort({ createdAt: -1 }) // Most recent first
            .select('courseTitle createdAt updatedAt'); // Only get necessary fields for list view

        res.status(200).json({
            message: 'Documents retrieved successfully',
            data: docs,
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        console.error('Get documents error:', error);
        
        res.status(500).json({
            message: 'Failed to retrieve documents',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
};

// Add new endpoint to get a single document
export const getDoc = async (req: AuthRequest, res: Response) => {
    const { docId } = req.params;
    const userId = req.user?._id;

    if (!userId) {
        return res.status(401).json({
            message: 'Unauthorized',
            timestamp: new Date().toISOString()
        });
    }

    try {
        const doc = await StructuredDoc.findOne({ _id: docId, createdBy: userId });
        
        if (!doc) {
            return res.status(404).json({
                message: 'Document not found',
                timestamp: new Date().toISOString()
            });
        }

        res.status(200).json({
            message: 'Document retrieved successfully',
            data: doc,
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        console.error('Get document error:', error);
        
        res.status(500).json({
            message: 'Failed to retrieve document',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
};

// Add new endpoint to update a document
export const updateDoc = async (req: AuthRequest, res: Response) => {
    const { docId } = req.params;
    const { structuredDoc } = req.body;
    const userId = req.user?._id;

    if (!userId) {
        return res.status(401).json({
            message: 'Unauthorized',
            timestamp: new Date().toISOString()
        });
    }

    // Input validation
    if (!structuredDoc || !structuredDoc.courseTitle || !Array.isArray(structuredDoc.modules)) {
        return res.status(400).json({
            message: 'Invalid input',
            details: 'Document structure is invalid',
            timestamp: new Date().toISOString()
        });
    }

    try {
        const doc = await StructuredDoc.findOne({ _id: docId, createdBy: userId });
        
        if (!doc) {
            return res.status(404).json({
                message: 'Document not found',
                timestamp: new Date().toISOString()
            });
        }

        // Update the document
        doc.courseTitle = structuredDoc.courseTitle;
        doc.modules = structuredDoc.modules;
        await doc.save();

        res.status(200).json({
            message: 'Document updated successfully',
            data: doc,
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        console.error('Update document error:', error);
        
        res.status(500).json({
            message: 'Failed to update document',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
};

export const addToCourse = async (req: AuthRequest, res: Response) => {
    const { docId, rawText, targetModuleIndex } = req.body;
    const userId = req.user?._id;

    if (!userId) {
        return res.status(401).json({
            message: 'Unauthorized',
            timestamp: new Date().toISOString()
        });
    }

    // Input validation
    if (!docId || !rawText || typeof rawText !== 'string' || rawText.trim().length < 10) {
        return res.status(400).json({
            message: 'Invalid input',
            details: 'Document ID and content text are required',
            timestamp: new Date().toISOString()
        });
    }

    try {
        // Get the existing document
        const existingDoc = await StructuredDoc.findOne({ _id: docId, createdBy: userId });
        if (!existingDoc) {
            return res.status(404).json({
                message: 'Document not found',
                timestamp: new Date().toISOString()
            });
        }

        // Generate new content using AI
        const aiResponse = await callAimLapi(rawText);
        const newContent = JSON.parse(aiResponse);

        // Update the document based on targetModuleIndex
        if (targetModuleIndex !== null && targetModuleIndex >= 0 && targetModuleIndex < existingDoc.modules.length) {
            // Add to specific module
            const targetModule = newContent.modules[0];
            if (targetModule) {
                existingDoc.modules[targetModuleIndex].lessons.push(...targetModule.lessons);
            }
        } else {
            // Add as new modules
            existingDoc.modules.push(...newContent.modules);
        }

        // Save the updated document
        await existingDoc.save();

        res.status(200).json({
            message: 'Content added to course successfully',
            data: existingDoc,
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        console.error('Add to course error:', error);
        
        if (error.message.includes('not in valid JSON format')) {
            return res.status(500).json({
                message: 'Failed to add content',
                details: 'AI response was not in the expected format',
                timestamp: new Date().toISOString()
            });
        }

        res.status(500).json({
            message: 'Failed to add content to course',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
};
