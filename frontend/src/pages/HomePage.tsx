import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const HomePage: React.FC = () => {
    const { user, isAdmin } = useAuth();

    return (
        <div className="container">
            <div style={{ padding: '2rem 0', textAlign: 'center' }}>
                <h1>Система управления анкетами</h1>
                <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '2rem' }}>
                    Создавайте, редактируйте и управляйте анкетами пользователей
                </p>

                {!user ? (
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/register" className="btn btn-primary">
                            Зарегистрироваться
                        </Link>
                        <Link to="/login" className="btn btn-secondary">
                            Войти
                        </Link>
                        <Link to="/admin-login" className="btn btn-success">
                            Панель администратора
                        </Link>
                    </div>
                ) : (
                    <div>
                        <h3>Добро пожаловать, {user.email}!</h3>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1rem' }}>
                            {isAdmin ? (
                                <>
                                    <Link to="/admin/dashboard" className="btn btn-primary">
                                        Панель администратора
                                    </Link>
                                    <Link to="/admin/forms" className="btn btn-secondary">
                                        Управление анкетами
                                    </Link>
                                    <Link to="/admin/users" className="btn btn-success">
                                        Управление пользователями
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link to="/dashboard" className="btn btn-primary">
                                        Мой кабинет
                                    </Link>
                                    <Link to="/create-form" className="btn btn-success">
                                        Создать анкету
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}

                <div className="card" style={{ maxWidth: '800px', margin: '3rem auto 0', textAlign: 'left' }}>
                    <h3>Функциональность системы</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                        <div>
                            <h4>Для пользователей</h4>
                            <ul style={{ lineHeight: '1.8' }}>
                                <li>Регистрация и авторизация</li>
                                <li>Создание анкет</li>
                                <li>Редактирование своих анкет</li>
                                <li>Просмотр истории анкет</li>
                            </ul>
                        </div>
                        <div>
                            <h4>Для администраторов</h4>
                            <ul style={{ lineHeight: '1.8' }}>
                                <li>Просмотр всех пользователей</li>
                                <li>Управление всеми анкетами</li>
                                <li>Редактирование анкет</li>
                                <li>Удаление анкет</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;