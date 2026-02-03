import User from './User';
import Appointment from './Appointment';
import Exam from './Exam';

User.hasMany(Appointment, { foreignKey: 'userId', as: 'appointments' });
Appointment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export { User, Appointment, Exam };
