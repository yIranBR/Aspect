import { Request, Response } from 'express';
import Appointment from '../models/Appointment';
import Exam from '../models/Exam';

export const createAppointment = async (req: Request, res: Response) => {
  try {
    const { examId, scheduledDate, notes } = req.body;

    if (!examId || !scheduledDate) {
      return res.status(400).json({ error: 'ExamId and scheduledDate are required' });
    }

    const exam = await Exam.findByPk(examId);
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    const appointment = await Appointment.create({
      examId,
      scheduledDate,
      notes,
    });

    const appointmentWithExam = await Appointment.findByPk(appointment.id, {
      include: [{ model: Exam, as: 'exam' }],
    });

    res.status(201).json(appointmentWithExam);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create appointment' });
  }
};

export const getAllAppointments = async (req: Request, res: Response) => {
  try {
    const appointments = await Appointment.findAll({
      include: [{ model: Exam, as: 'exam' }],
      order: [['scheduledDate', 'ASC']],
    });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
};

export const deleteAppointment = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const appointment = await Appointment.findByPk(parseInt(id, 10));
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    await appointment.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete appointment' });
  }
};
