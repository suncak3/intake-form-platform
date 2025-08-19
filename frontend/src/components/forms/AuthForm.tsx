import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface AuthFormData {
    email: string;
    password: string;
}

const schema = yup.object({
    email: yup.string().email('Некорректный email').required('Email обязателен'),
    password: yup.string().min(6, 'Минимум 6 символов').required('Пароль обязателен'),
});

interface AuthFormProps {
    mode: 'login' | 'register' | 'admin';
    title: string;
}

const AuthForm: React.FC<AuthFormProps> = ({ mode, title }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const { login, register, adminLogin } = useAuth();
    const navigate = useNavigate();

    const {
        register: registerField,
        handleSubmit,
        formState: { errors },
    } = useForm<AuthFormData>({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data: AuthFormData) => {
        setIsLoading(true);
        setError('');

        try {
            if (mode === 'login') {
                await login(data.email, data.password);
                navigate('/dashboard');
            } else if (mode === 'register') {
                await register(data.email, data.password);
                navigate('/dashboard');
            } else if (mode === 'admin') {
                await adminLogin(data.email, data.password);
                navigate('/admin/dashboard');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit(onSubmit)} className="form">
                <h2 className="text-center mb-4">{title}</h2>

                {error && (
                    <div className="form-error mb-3" style={{ textAlign: 'center', padding: '0.75rem', backgroundColor: '#f8d7da', borderRadius: '4px' }}>
                        {error}
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        id="email"
                        type="email"
                        className="form-input"
                        {...registerField('email')}
                        placeholder="example@email.com"
                    />
                    {errors.email && <div className="form-error">{errors.email.message}</div>}
                </div>

                <div className="form-group">
                    <label htmlFor="password" className="form-label">Пароль</label>
                    <input
                        id="password"
                        type="password"
                        className="form-input"
                        {...registerField('password')}
                        placeholder="Минимум 6 символов"
                    />
                    {errors.password && <div className="form-error">{errors.password.message}</div>}
                </div>

                <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                    disabled={isLoading}
                >
                    {isLoading ? 'Загрузка...' :
                        mode === 'login' ? 'Войти' :
                            mode === 'register' ? 'Зарегистрироваться' : 'Войти как админ'}
                </button>

                <div className="text-center mt-3">
                    {mode === 'login' && (
                        <>
                            <p>Нет аккаунта? <a href="/register">Зарегистрируйтесь</a></p>
                            <p><a href="/admin-login">Вход для администраторов</a></p>
                        </>
                    )}
                    {mode === 'register' && (
                        <p>Уже есть аккаунт? <a href="/login">Войдите</a></p>
                    )}
                    {mode === 'admin' && (
                        <p><a href="/login">Обычный вход</a></p>
                    )}
                </div>
            </form>
        </div>
    );
};

export default AuthForm;