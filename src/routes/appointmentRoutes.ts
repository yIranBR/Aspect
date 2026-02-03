import { Router } from 'express';
import { createAppointment, getAllAppointments, deleteAppointment, updateAppointment } from '../controllers/appointmentController';
import { authenticate, authorize } from '../middlewares/auth';
import { UserRole } from '../models/User';

const router = Router();

router.post('/appointments', authenticate, createAppointment);
router.get('/appointments', authenticate, getAllAppointments);
router.put('/appointments/:id', authenticate, authorize(UserRole.ADMIN), updateAppointment);
router.delete('/appointments/:id', authenticate, deleteAppointment);

export default router;
