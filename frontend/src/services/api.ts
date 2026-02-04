import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:9101/api';

export interface Exam {
  id: number;
  name: string;
  specialty: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'patient' | 'admin';
}

export interface Appointment {
  id: number;
  examId: number;
  userId: number;
  scheduledDate: string;
  date: string;
  notes?: string;
  exam?: Exam;
  user?: User;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

console.log('API: Base URL configured as', API_BASE_URL);

api.interceptors.request.use((config) => {
  console.log('API: Request to', config.url);
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log('API: Response from', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('API: Error from', error.config?.url, error.response?.status, error.message);
    return Promise.reject(error);
  }
);

export const authService = {
  register: (data: { email: string; password: string; name: string; role?: 'patient' | 'admin' }) => {
    console.log('API: Calling register');
    return api.post<AuthResponse>('auth/register', data);
  },
  login: (data: { email: string; password: string }) => {
    console.log('API: Calling login with', data.email);
    return api.post<AuthResponse>('auth/login', data);
  },
  getProfile: () => {
    console.log('API: Calling getProfile');
    return api.get<User>('auth/profile');
  },
  updateProfile: (data: { name?: string; email?: string }) => {
    console.log('API: Calling updateProfile');
    return api.put<User>('auth/profile', data);
  },
  getAllUsers: () => {
    console.log('API: Calling getAllUsers');
    return api.get<User[]>('auth/users');
  },
};

export const examService = {
  getAll: () => api.get<Exam[]>('/exams'),
  getById: (id: number) => api.get<Exam>(`/exams/${id}`),
  create: (data: { name: string; specialty: string; description?: string }) =>
    api.post<Exam>('/exams', data),
  update: (id: number, data: { name?: string; specialty?: string; description?: string }) =>
    api.put<Exam>(`/exams/${id}`, data),
  delete: (id: number) => api.delete(`/exams/${id}`),
};

export const appointmentService = {
  getAll: () => api.get<Appointment[]>('/appointments'),
  create: (data: { examId: number; scheduledDate: string; notes?: string; userId?: number }) =>
    api.post<Appointment>('/appointments', {
      examId: data.examId,
      date: data.scheduledDate,
      notes: data.notes,
      userId: data.userId,
    }),
  update: (id: number, data: { examId?: number; scheduledDate?: string; notes?: string }) =>
    api.put<Appointment>(`/appointments/${id}`, {
      examId: data.examId,
      date: data.scheduledDate,
      notes: data.notes,
    }),
  delete: (id: number) => api.delete(`/appointments/${id}`),
};
