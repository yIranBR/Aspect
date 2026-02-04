import { Router } from 'express';
import { createAppointment, getAppointments, getAppointmentById, deleteAppointment, updateAppointment } from '../controllers/appointmentController';
import { authenticate, authorize } from '../middlewares/auth';
import { UserRole } from '../models/User';

const router = Router();

router.post('/appointments', authenticate, createAppointment);
router.get('/appointments', authenticate, getAppointments);
router.get('/appointments/:id', authenticate, getAppointmentById);
router.put('/appointments/:id', authenticate, updateAppointment);
router.delete('/appointments/:id', authenticate, deleteAppointment);

export default router;
