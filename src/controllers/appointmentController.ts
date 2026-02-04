import { Request, Response } from 'express';
import Appointment, { AppointmentStatus } from '../models/Appointment';
import Exam from '../models/Exam';
import User from '../models/User';
import { sendAppointmentConfirmationEmail } from '../services/emailService';

export const createAppointment = async (req: Request, res: Response) => {
  try {
    const { examId, date, notes, userId: requestUserId } = req.body;
    const currentUser = (req as any).user;

    // Admin can create appointments for any user, patients only for themselves
    let targetUserId = currentUser.id;
    if (currentUser.role === 'admin' && requestUserId) {
      targetUserId = requestUserId;
    }

    if (!examId || !date) {
      return res.status(400).json({ error: 'Exam ID and date are required' });
    }

    const exam = await Exam.findByPk(examId);
    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    // Parse date string as local time (not UTC)
    // If date is in format YYYY-MM-DDTHH:mm, use it directly without timezone conversion
    const dateString = date;
    let appointmentDate: Date;
    
    if (dateString.includes('T')) {
      // Format: YYYY-MM-DDTHH:mm - parse as local time
      const [datePart, timePart] = dateString.split('T');
      const [year, month, day] = datePart.split('-').map(Number);
      const [hour, minute] = timePart.split(':').map(Number);
      appointmentDate = new Date(year, month - 1, day, hour, minute || 0, 0, 0);
    } else {
      appointmentDate = new Date(dateString);
    }

    // Adicionar 3 horas para corrigir timezone
    appointmentDate.setHours(appointmentDate.getHours() + 3);

    const appointment = await Appointment.create({
      userId: targetUserId,
      examId,
      date: appointmentDate,
      notes,
      status: AppointmentStatus.SCHEDULED,
    });

    const appointmentWithDetails = await Appointment.findByPk(appointment.id, {
      include: [
        { model: Exam, as: 'exam' },
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
      ],
    });

    // Enviar email de confirmação
    if (appointmentWithDetails) {
      const appointmentData = appointmentWithDetails.toJSON() as any;
      if (appointmentData.user && appointmentData.exam) {
        try {
          await sendAppointmentConfirmationEmail({
            patientName: appointmentData.user.name,
            patientEmail: appointmentData.user.email,
            examName: appointmentData.exam.name,
            examSpecialty: appointmentData.exam.specialty,
            appointmentDate: appointmentWithDetails.date,
            notes: appointmentWithDetails.notes || undefined,
          });
        } catch (emailError) {
          console.error('Erro ao enviar email, mas agendamento foi criado:', emailError);
        }
      }
    }

    res.status(201).json(appointmentWithDetails);
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ error: 'Failed to create appointment' });
  }
};

export const getAppointments = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const userRole = (req as any).user.role;

    let whereClause = {};
    if (userRole !== 'admin') {
      whereClause = { userId };
    }

    const appointments = await Appointment.findAll({
      where: whereClause,
      include: [
        { model: Exam, as: 'exam' },
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
      ],
      order: [['date', 'ASC']],
    });

    res.json(appointments);
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ error: 'Failed to get appointments' });
  }
};

export const getAppointmentById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const userId = (req as any).user.id;
    const userRole = (req as any).user.role;

    const appointment = await Appointment.findByPk(id, {
      include: [
        { model: Exam, as: 'exam' },
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
      ],
    });

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    if (userRole !== 'admin' && appointment.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(appointment);
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({ error: 'Failed to get appointment' });
  }
};

export const updateAppointment = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const { date, notes, status } = req.body;
    const userId = (req as any).user.id;
    const userRole = (req as any).user.role;

    const appointment = await Appointment.findByPk(id);

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    if (userRole !== 'admin' && appointment.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Parse date with local timezone (same logic as create)
    if (date) {
      const dateString = date;
      if (dateString.includes('T')) {
        const [datePart, timePart] = dateString.split('T');
        const [year, month, day] = datePart.split('-').map(Number);
        const [hour, minute] = timePart.split(':').map(Number);
        appointment.date = new Date(year, month - 1, day, hour, minute || 0, 0, 0);
      } else {
        appointment.date = new Date(dateString);
      }
    }
    if (notes !== undefined) appointment.notes = notes;
    if (status && userRole === 'admin') appointment.status = status;

    await appointment.save();

    const updatedAppointment = await Appointment.findByPk(id, {
      include: [
        { model: Exam, as: 'exam' },
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
      ],
    });

    res.json(updatedAppointment);
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({ error: 'Failed to update appointment' });
  }
};

export const deleteAppointment = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const userId = (req as any).user.id;
    const userRole = (req as any).user.role;

    const appointment = await Appointment.findByPk(id);

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    if (userRole !== 'admin' && appointment.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await appointment.destroy();

    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Delete appointment error:', error);
    res.status(500).json({ error: 'Failed to delete appointment' });
  }
};
