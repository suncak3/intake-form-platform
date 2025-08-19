import axios, { AxiosResponse } from 'axios';
import {
    ApiResponse,
    LoginData,
    RegisterData,
    AuthResponse,
    Form,
    CreateFormData,
    Gender,
    ProgrammingLanguage,
    User
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const apiService = {
    async register(data: RegisterData): Promise<AuthResponse> {
        const response: AxiosResponse<AuthResponse> = await api.post('/api/users/register', data);
        return response.data;
    },

    async login(data: LoginData): Promise<AuthResponse> {
        const response: AxiosResponse<AuthResponse> = await api.post('/api/users/login', data);
        return response.data;
    },

    async adminLogin(data: LoginData): Promise<AuthResponse> {
        const response: AxiosResponse<AuthResponse> = await api.post('/api/admin/login', data);
        return response.data;
    },

    async getUserProfile(): Promise<{ user: User }> {
        const response: AxiosResponse<{ user: User }> = await api.get('/api/users/profile');
        return response.data;
    },

    async getGenders(): Promise<{ genders: Gender[] }> {
        const response: AxiosResponse<{ genders: Gender[] }> = await api.get('/api/dictionaries/genders');
        return response.data;
    },

    async getProgrammingLanguages(): Promise<{ programming_languages: ProgrammingLanguage[] }> {
        const response: AxiosResponse<{ programming_languages: ProgrammingLanguage[] }> =
            await api.get('/api/dictionaries/programming-languages');
        return response.data;
    },

    async createForm(data: CreateFormData): Promise<{ form: Form }> {
        const response: AxiosResponse<{ form: Form }> = await api.post('/api/forms', data);
        return response.data;
    },

    async getForm(id: number): Promise<Form> {
        const response: AxiosResponse<Form> = await api.get(`/api/forms/${id}`);
        return response.data;
    },


    async getMyForms(): Promise<{ forms: Form[] }> {
        const response: AxiosResponse<{ forms: Form[] }> = await api.get('/api/users/forms');
        return response.data;
    },

    async updateMyForm(id: number, data: Partial<CreateFormData>): Promise<{ form: Form }> {
        const response: AxiosResponse<{ form: Form }> = await api.put(`/api/users/forms/${id}`, data);
        return response.data;
    },

    async deleteMyForm(id: number): Promise<{ message: string }> {
        const response: AxiosResponse<{ message: string }> = await api.delete(`/api/users/forms/${id}`);
        return response.data;
    },

    async getAllUsers(page = 1, limit = 20): Promise<{
        users: User[];
        total: number;
        page: number;
        totalPages: number;
    }> {
        const response = await api.get(`/api/admin/users?page=${page}&limit=${limit}`);
        return response.data;
    },

    async getAllForms(page = 1, limit = 20): Promise<{
        forms: Form[];
        total: number;
        page: number;
        totalPages: number;
    }> {
        const response = await api.get(`/api/admin/forms?page=${page}&limit=${limit}`);
        return response.data;
    },


    async updateFormAdmin(id: number, data: Partial<CreateFormData>): Promise<{ form: Form }> {
        const response: AxiosResponse<{ form: Form }> = await api.put(`/api/admin/forms/${id}`, data);
        return response.data;
    },

    async deleteFormAdmin(id: number): Promise<{ message: string }> {
        const response: AxiosResponse<{ message: string }> = await api.delete(`/api/admin/forms/${id}`);
        return response.data;
    }
};

export default api;