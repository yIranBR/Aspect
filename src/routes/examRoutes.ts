import { Router } from 'express';
import { getAllExams, getExamById, createExam, updateExam, deleteExam } from '../controllers/examController';
import { authenticate } from '../middlewares/auth';

const router = Router();

router.get('/exams', getAllExams);
router.get('/exams/:id', getExamById);
router.post('/exams', authenticate, createExam);
router.put('/exams/:id', authenticate, updateExam);
router.delete('/exams/:id', authenticate, deleteExam);

export default router;
