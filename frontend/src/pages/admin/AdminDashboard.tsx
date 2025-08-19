import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { apiService } from '../../services/api';

interface DashboardStats {
    totalUsers: number;
    totalForms: number;
}

const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats>({ totalUsers: 0, totalForms: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const loadStats = async () => {
            try {
                const [usersResponse, formsResponse] = await Promise.all([
                    apiService.getAllUsers(1, 1),
                    apiService.getAllForms(1, 1)
                ]);

                setStats({
                    totalUsers: usersResponse.total,
                    totalForms: formsResponse.total
                });
            } catch (error) {
                console.error('Ошибка загрузки статистики:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadStats();
    }, []);

    return (
        <div className="container">
            <div style={{ marginBottom: '2rem' }}>
                <h2>Панель администратора</h2>
                <p style={{ color: '#666' }}>Добро пожаловать, {user?.email}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="card text-center">
                    <h3 style={{ color: '#007bff', fontSize: '2.5rem', margin: '0.5rem 0' }}>
                        {isLoading ? '...' : stats.totalUsers}
                    </h3>
                    <p style={{ color: '#666', marginBottom: '1rem' }}>Всего пользователей</p>
                    <Link to="/admin/users" className="btn btn-primary">
                        Управление пользователями
                    </Link>
                </div>

                <div className="card text-center">
                    <h3 style={{ color: '#28a745', fontSize: '2.5rem', margin: '0.5rem 0' }}>
                        {isLoading ? '...' : stats.totalForms}
                    </h3>
                    <p style={{ color: '#666', marginBottom: '1rem' }}>Всего анкет</p>
                    <Link to="/admin/forms" className="btn btn-success">
                        Управление анкетами
                    </Link>
                </div>
            </div>

            <div className="card">
                <h3>Быстрые действия</h3>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                    <Link to="/admin/users" className="btn btn-secondary">
                        Все пользователи
                    </Link>
                    <Link to="/admin/forms" className="btn btn-secondary">
                        Все анкеты
                    </Link>
                    <Link to="/create-form" className="btn btn-secondary">
                        Создать анкету
                    </Link>
                </div>
            </div>

            <div className="card" style={{ marginTop: '2rem' }}>
                <h3>Информация о системе</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div>
                        <p><strong>Роль:</strong> Администратор</p>
                        <p><strong>Email:</strong> {user?.email}</p>
                    </div>
                    <div>
                        <p><strong>Права доступа:</strong> Полные</p>
                        <p><strong>Статус:</strong> Активен</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;