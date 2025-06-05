import express, { RequestHandler } from 'express';
import { structureDoc, saveDoc, getUserDocs, getDoc, updateDoc, addToCourse } from '../controllers/aiController';
import { authenticateUser, authorizeRoles } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/structure-doc', authenticateUser, authorizeRoles('admin'), structureDoc as RequestHandler);
router.post('/save-doc', authenticateUser, authorizeRoles('admin'), saveDoc as RequestHandler);
router.get('/user-docs', authenticateUser, authorizeRoles('admin'), getUserDocs as RequestHandler);
router.get('/doc/:docId', authenticateUser, authorizeRoles('admin'), getDoc as RequestHandler);
router.put('/doc/:docId', authenticateUser, authorizeRoles('admin'), updateDoc as RequestHandler);

router.post('/structure', authenticateUser, authorizeRoles('admin'), structureDoc as RequestHandler);
router.post('/add-to-course', authenticateUser, authorizeRoles('admin'), addToCourse as RequestHandler);

export default router;
