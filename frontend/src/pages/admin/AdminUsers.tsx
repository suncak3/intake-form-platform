import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { apiService } from '../../services/api';

const AdminUsers: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [total, setTotal] = useState(0);

    const loadUsers = async (page: number = 1) => {
        setIsLoading(true);
        try {
            const response = await apiService.getAllUsers(page, 10);
            setUsers(response.users);
            setCurrentPage(response.page);
            setTotalPages(response.totalPages);
            setTotal(response.total);
        } catch (error: any) {
            setError(error.response?.data?.error || 'Ошибка загрузки пользователей');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handlePageChange = (page: number) => {
        loadUsers(page);
    };

    if (isLoading && users.length === 0) {
        return (
            <div className="container text-center" style={{ padding: '2rem' }}>
                <h3>Загрузка пользователей...</h3>
            </div>
        );
    }

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Управление пользователями</h2>
                <div>
                    <span style={{ color: '#666' }}>Всего: {total} пользователей</span>
                </div>
            </div>

            {error && (
                <div
                    style={{
                        padding: '0.75rem',
                        backgroundColor: '#f8d7da',
                        color: '#721c24',
                        border: '1px solid #f5c6cb',
                        borderRadius: '4px',
                        marginBottom: '1rem',
                    }}
                >
                    {error}
                </div>
            )}

            {users.length === 0 ? (
                <div className="card text-center">
                    <h3>Пользователей пока нет</h3>
                    <p style={{ color: '#666' }}>В системе еще не зарегистрировано ни одного пользователя</p>
                </div>
            ) : (
                <>
                    {users.map((user: any) => (
                        <div key={user.id} className="card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h4>{user.email}</h4>
                                    <p><strong>ID:</strong> {user.id}</p>
                                    <p><strong>Количество анкет:</strong> {user.forms?.length || 0}</p>

                                    {user.forms && user.forms.length > 0 && (
                                        <div style={{ marginTop: '0.5rem' }}>
                                            <strong>Анкеты:</strong>
                                            <ul style={{ marginLeft: '1rem', marginTop: '0.25rem' }}>
                                                {user.forms.slice(0, 3).map((form: any) => (
                                                    <li key={form.id}>
                                                        {form.first_name} {form.last_name} ({form.gender?.name})
                                                    </li>
                                                ))}
                                                {user.forms.length > 3 && (
                                                    <li style={{ color: '#666' }}>... и еще {user.forms.length - 3}</li>
                                                )}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                <div className="d-flex gap-2" style={{ flexDirection: 'column', minWidth: '120px' }}>
                                    <button
                                        onClick={() => alert(`Детали пользователя ${user.email} (будет добавлено позже)`)}
                                        className="btn btn-secondary"
                                        style={{ fontSize: '0.9rem', padding: '0.5rem' }}
                                    >
                                        Детали
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {totalPages > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1 || isLoading}
                                className="btn btn-secondary"
                            >
                                ← Предыдущая
                            </button>

                            <span style={{ padding: '0.75rem 1rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                Страница {currentPage} из {totalPages}
              </span>

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages || isLoading}
                                className="btn btn-secondary"
                            >
                                Следующая →
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AdminUsers;