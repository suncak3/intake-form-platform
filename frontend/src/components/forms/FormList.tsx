import React from 'react';
import { Form } from '../../types';

interface FormListProps {
    forms: Form[];
    onView: (form: Form) => void;
    onEdit: (form: Form) => void;
    onDelete: (formId: number) => void;
    isLoading?: boolean;
    showActions?: boolean;
    isAdmin?: boolean;
}

const FormList: React.FC<FormListProps> = ({
                                               forms,
                                               onView,
                                               onEdit,
                                               onDelete,
                                               isLoading = false,
                                               showActions = true,
                                               isAdmin = false,
                                           }) => {
    if (isLoading) {
        return (
            <div className="text-center" style={{ padding: '2rem' }}>
                <h3>Загрузка анкет...</h3>
            </div>
        );
    }

    if (forms.length === 0) {
        return (
            <div className="card text-center">
                <h3>Анкет пока нет</h3>
                <p style={{ color: '#666', marginBottom: '1rem' }}>
                    {isAdmin ? 'В системе еще не создано анкет' : 'Вы еще не создали ни одной анкеты'}
                </p>
                {!isAdmin && (
                    <a href="/create-form" className="btn btn-primary">
                        Создать первую анкету
                    </a>
                )}
            </div>
        );
    }

    return (
        <div>
            <h3 style={{ marginBottom: '1.5rem' }}>
                Всего анкет: {forms.length}
            </h3>

            {forms.map((form) => (
                <div key={form.id} className="card">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h4 className="card-title">
                                {form.first_name} {form.last_name}
                                {form.middle_name && ` ${form.middle_name}`}
                                {isAdmin && <span style={{ color: '#666', fontSize: '0.9rem' }}> (ID: {form.id})</span>}
                            </h4>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', marginTop: '0.5rem' }}>
                                <p><strong>ИИН:</strong> {form.iin}</p>
                                <p><strong>Телефон:</strong> {form.phone}</p>
                                <p><strong>Пол:</strong> {form.gender?.name || 'Не указан'}</p>
                            </div>

                            {isAdmin && (
                                <p style={{ marginTop: '0.5rem', color: '#007bff' }}>
                                    <strong>Владелец:</strong> {form.user ? form.user.email : 'Анонимная анкета'}
                                </p>
                            )}

                            {(form.programming_language || form.custom_programming_language) && (
                                <p style={{ marginTop: '0.5rem' }}>
                                    <strong>Язык программирования:</strong>{' '}
                                    {form.programming_language?.name || form.custom_programming_language}
                                </p>
                            )}
                        </div>

                        {showActions && (
                            <div className="d-flex gap-2" style={{ flexDirection: 'column', minWidth: '120px' }}>
                                <button
                                    onClick={() => onView(form)}
                                    className="btn btn-secondary"
                                    style={{ fontSize: '0.9rem', padding: '0.5rem' }}
                                >
                                    Просмотр
                                </button>
                                <button
                                    onClick={() => onEdit(form)}
                                    className="btn btn-primary"
                                    style={{ fontSize: '0.9rem', padding: '0.5rem' }}
                                >
                                    Изменить
                                </button>
                                <button
                                    onClick={() => onDelete(form.id)}
                                    className="btn btn-danger"
                                    style={{ fontSize: '0.9rem', padding: '0.5rem' }}
                                >
                                    Удалить
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FormList;