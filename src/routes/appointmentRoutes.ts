import { Router } from 'express';
import { createAppointment, getAllAppointments, deleteAppointment } from '../controllers/appointmentController';

const router = Router();

router.post('/appointments', createAppointment);
router.get('/appointments', getAllAppointments);
router.delete('/appointments/:id', deleteAppointment);

export default router;
