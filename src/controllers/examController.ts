import { Request, Response } from 'express';
import Exam from '../models/Exam';
import { cacheService, CACHE_KEYS } from '../services/cacheService';

export const getAllExams = async (req: Request, res: Response) => {
  try {
    // Tentar buscar do cache primeiro
    const cachedExams = cacheService.get<Exam[]>(CACHE_KEYS.EXAMS);
    if (cachedExams) {
      return res.json(cachedExams);
    }

    // Se não tiver em cache, buscar do banco
    const exams = await Exam.findAll();
    
    // Salvar no cache por 5 minutos
    cacheService.set(CACHE_KEYS.EXAMS, exams);
    
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

export const createExam = async (req: Request, res: Response) => {
  try {
    const { name, specialty, description } = req.body;
    
    if (!name || !specialty) {
      return res.status(400).json({ error: 'Name and specialty are required' });
    }

    const exam = await Exam.create({ name, specialty, description });
    
    // Invalidar cache de exames
    cacheService.invalidateExams();
    
    res.status(201).json(exam);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create exam' });
  }
};

export const updateExam = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { name, specialty, description } = req.body;

    const exam = await Exam.findByPk(parseInt(id, 10));
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    await exam.update({ name, specialty, description });
    
    // Invalidar cache de exames
    cacheService.invalidateExams();
    
    res.json(exam);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update exam' });
  }
};

export const deleteExam = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const exam = await Exam.findByPk(parseInt(id, 10));
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    await exam.destroy();
    
    // Invalidar cache de exames
    cacheService.invalidateExams();
    
    res.json({ message: 'Exam deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete exam' });
  }
};
