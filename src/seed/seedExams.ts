import Exam from '../models/Exam';

const examsData = [
  { name: 'Hemograma Completo', specialty: 'Hematologia' },
  { name: 'Raio-X de Tórax', specialty: 'Radiologia' },
  { name: 'Ultrassonografia Abdominal', specialty: 'Radiologia' },
  { name: 'Eletrocardiograma', specialty: 'Cardiologia' },
  { name: 'Ressonância Magnética', specialty: 'Radiologia' },
  { name: 'Teste Ergométrico', specialty: 'Cardiologia' },
  { name: 'Colonoscopia', specialty: 'Gastroenterologia' },
  { name: 'Mamografia', specialty: 'Radiologia' },
];

export const seedExams = async () => {
  try {
    const count = await Exam.count();
    if (count === 0) {
      await Exam.bulkCreate(examsData);
      console.log('Exams seeded successfully');
    } else {
      console.log('Exams already exist, skipping seed');
    }
  } catch (error) {
    console.error('Error seeding exams:', error);
  }
};
