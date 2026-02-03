import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:9101/api';

export interface Exam {
  id: number;
  name: string;
  specialty: string;
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
    return api.post<AuthResponse>('/auth/register', data);
  },
  login: (data: { email: string; password: string }) => {
    console.log('API: Calling login with', data.email);
    return api.post<AuthResponse>('/auth/login', data);
  },
  getProfile: () => {
    console.log('API: Calling getProfile');
    return api.get<User>('/auth/profile');
  },
};

export const examService = {
  getAll: () => api.get<Exam[]>('/exams'),
  getById: (id: number) => api.get<Exam>(`/exams/${id}`),
};

export const appointmentService = {
  getAll: () => api.get<Appointment[]>('/appointments'),
  create: (data: { examId: number; scheduledDate: string; notes?: string }) =>
    api.post<Appointment>('/appointments', data),
  update: (id: number, data: { examId?: number; scheduledDate?: string; notes?: string }) =>
    api.put<Appointment>(`/appointments/${id}`, data),
  delete: (id: number) => api.delete(`/appointments/${id}`),
};
