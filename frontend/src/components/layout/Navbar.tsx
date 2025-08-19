import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Navbar: React.FC = () => {
    const { user, isAdmin, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="container d-flex justify-content-between align-items-center">
                <Link to="/" className="navbar-brand">
                    Form App
                </Link>

                <ul className="navbar-nav d-flex">
                    {!user ? (
                        <>
                            <li><Link to="/login">Вход</Link></li>
                            <li><Link to="/register">Регистрация</Link></li>
                            <li><Link to="/admin-login">Админ</Link></li>
                        </>
                    ) : (
                        <>
                            <li>
                <span style={{ color: 'white', marginRight: '1rem' }}>
                  Привет, {user.email} {isAdmin && '(Админ)'}
                </span>
                            </li>
                            {isAdmin ? (
                                <>
                                    <li><Link to="/admin/dashboard">Панель админа</Link></li>
                                    <li><Link to="/admin/users">Пользователи</Link></li>
                                    <li><Link to="/admin/forms">Анкеты</Link></li>
                                </>
                            ) : (
                                <>
                                    <li><Link to="/dashboard">Мой кабинет</Link></li>
                                    <li><Link to="/create-form">Создать анкету</Link></li>
                                </>
                            )}
                            <li>
                                <button
                                    onClick={handleLogout}
                                    className="btn btn-secondary"
                                    style={{ padding: '0.25rem 0.75rem', fontSize: '0.9rem' }}
                                >
                                    Выйти
                                </button>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;