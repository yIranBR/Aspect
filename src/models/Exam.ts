import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ExamAttributes {
  id: number;
  name: string;
  specialty: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ExamCreationAttributes extends Optional<ExamAttributes, 'id'> {}

class Exam extends Model<ExamAttributes, ExamCreationAttributes> implements ExamAttributes {
  public id!: number;
  public name!: string;
  public specialty!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Exam.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    specialty: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'exams',
  }
);

export default Exam;
