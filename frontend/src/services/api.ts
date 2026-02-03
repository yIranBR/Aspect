import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:9101/api';

export interface Exam {
  id: number;
  name: string;
  specialty: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Appointment {
  id: number;
  examId: number;
  scheduledDate: string;
  notes?: string;
  exam?: Exam;
  createdAt?: string;
  updatedAt?: string;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const examService = {
  getAll: () => api.get<Exam[]>('/exams'),
  getById: (id: number) => api.get<Exam>(`/exams/${id}`),
};

export const appointmentService = {
  getAll: () => api.get<Appointment[]>('/appointments'),
  create: (data: { examId: number; scheduledDate: string; notes?: string }) =>
    api.post<Appointment>('/appointments', data),
  delete: (id: number) => api.delete(`/appointments/${id}`),
};
