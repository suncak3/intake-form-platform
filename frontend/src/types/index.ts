export interface ApiResponse<T = any> {
    message?: string;
    error?: string;
    details?: string[];
    [key: string]: any;
}

export interface User {
    id: number;
    email: string;
}

export interface Gender {
    id: number;
    name: string;
    code: string;
}

export interface ProgrammingLanguage {
    id: number;
    name: string;
    is_predefined: boolean;
}

export interface Form {
    id: number;
    user_id?: number;
    first_name: string;
    last_name: string;
    middle_name?: string;
    iin: string;
    gender_id: number;
    birth_date: string;
    phone: string;
    programming_language_id?: number;
    custom_programming_language?: string;
    created_at: string;
    updated_at: string;
    user?: User;
    gender?: Gender;
    programming_language?: ProgrammingLanguage;
}

export interface CreateFormData {
    first_name: string;
    last_name: string;
    middle_name?: string;
    iin: string;
    gender_id: number;
    birth_date: string;
    phone: string;
    programming_language_id?: number;
    custom_programming_language?: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    user?: User;
    admin?: User;
}

export interface AuthContextType {
    user: User | null;
    isAdmin: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    adminLogin: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => void;
}