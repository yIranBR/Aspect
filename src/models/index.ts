import User from './User';
import Appointment from './Appointment';
import Exam from './Exam';

User.hasMany(Appointment, { foreignKey: 'userId', as: 'appointments' });
Appointment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Exam.hasMany(Appointment, { foreignKey: 'examId', as: 'appointments' });
Appointment.belongsTo(Exam, { foreignKey: 'examId', as: 'exam' });

export { User, Appointment, Exam };
