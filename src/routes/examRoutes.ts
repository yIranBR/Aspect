import { Router } from 'express';
import { getAllExams, getExamById } from '../controllers/examController';

const router = Router();

router.get('/exams', getAllExams);
router.get('/exams/:id', getExamById);

export default router;
