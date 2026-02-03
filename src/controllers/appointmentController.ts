import { Request, Response } from 'express';
import Appointment from '../models/Appointment';
import Exam from '../models/Exam';
import User, { UserRole } from '../models/User';

export const createAppointment = async (req: Request, res: Response) => {
  try {
    const { examId, scheduledDate, notes } = req.body;
    const userId = (req as any).user.id;

    if (!examId || !scheduledDate) {
      return res.status(400).json({ error: 'ExamId and scheduledDate are required' });
    }

    const exam = await Exam.findByPk(examId);
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    const appointment = await Appointment.create({
      examId,
      userId,
      scheduledDate,
      notes,
    });

    const appointmentWithExam = await Appointment.findByPk(appointment.id, {
      include: [
        { model: Exam, as: 'exam' },
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] }
      ],
    });

    res.status(201).json(appointmentWithExam);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create appointment' });
  }
};

export const getAllAppointments = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const whereClause = user.role === UserRole.PATIENT ? { userId: user.id } : {};

    const appointments = await Appointment.findAll({
      where: whereClause,
      include: [
        { model: Exam, as: 'exam' },
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] }
      ],
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
    const user = (req as any).user;

    const appointment = await Appointment.findByPk(parseInt(id, 10));
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    if (user.role === UserRole.PATIENT && appointment.userId !== user.id) {
      return res.status(403).json({ error: 'You can only delete your own appointments' });
    }

    await appointment.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete appointment' });
  }
};

export const updateAppointment = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const user = (req as any).user;
    const { examId, scheduledDate, notes } = req.body;

    const appointment = await Appointment.findByPk(parseInt(id, 10));
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    if (user.role !== UserRole.ADMIN) {
      return res.status(403).json({ error: 'Only administrators can edit appointments' });
    }

    if (examId) {
      const exam = await Exam.findByPk(examId);
      if (!exam) {
        return res.status(404).json({ error: 'Exam not found' });
      }
      appointment.examId = examId;
    }

    if (scheduledDate) appointment.scheduledDate = scheduledDate;
    if (notes !== undefined) appointment.notes = notes;

    await appointment.save();

    const updatedAppointment = await Appointment.findByPk(appointment.id, {
      include: [
        { model: Exam, as: 'exam' },
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] }
      ],
    });

    res.json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update appointment' });
  }
};
