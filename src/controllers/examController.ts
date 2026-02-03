import { Request, Response } from 'express';
import Exam from '../models/Exam';

export const getAllExams = async (req: Request, res: Response) => {
  try {
    const exams = await Exam.findAll();
    res.json(exams);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch exams' });
  }
};

export const getExamById = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const exam = await Exam.findByPk(parseInt(id, 10));
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }
    res.json(exam);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch exam' });
  }
};
