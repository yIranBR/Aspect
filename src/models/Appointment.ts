import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import Exam from './Exam';

interface AppointmentAttributes {
  id: number;
  examId: number;
  scheduledDate: Date;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface AppointmentCreationAttributes extends Optional<AppointmentAttributes, 'id' | 'notes'> {}

class Appointment extends Model<AppointmentAttributes, AppointmentCreationAttributes> implements AppointmentAttributes {
  public id!: number;
  public examId!: number;
  public scheduledDate!: Date;
  public notes?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Appointment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    examId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'exams',
        key: 'id',
      },
    },
    scheduledDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'appointments',
  }
);

Appointment.belongsTo(Exam, { foreignKey: 'examId', as: 'exam' });
Exam.hasMany(Appointment, { foreignKey: 'examId', as: 'appointments' });

export default Appointment;
