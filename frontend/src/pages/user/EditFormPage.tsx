import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FormBuilder from '../../components/forms/FormBuilder';
import { CreateFormData, Form } from '../../types';
import { apiService } from '../../services/api';

const EditFormPage: React.FC = () => {
    const [form, setForm] = useState<Form | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingForm, setIsLoadingForm] = useState(true);
    const [error, setError] = useState<string>('');

    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        const loadForm = async () => {
            if (!id) {
                setError('ID анкеты не указан');
                setIsLoadingForm(false);
                return;
            }

            try {
                const response = await apiService.getForm(parseInt(id));
                setForm(response);
            } catch (error: any) {
                setError(error.response?.data?.error || 'Ошибка загрузки анкеты');
            } finally {
                setIsLoadingForm(false);
            }
        };

        loadForm();
    }, [id]);

    const handleSubmit = async (data: CreateFormData) => {
        if (!form) return;

        setIsLoading(true);
        setError('');

        try {
            await apiService.updateMyForm(form.id, data);
            navigate('/dashboard', {
                state: { message: 'Анкета успешно обновлена!' }
            });
        } catch (err: any) {
            setError(err.response?.data?.error || 'Ошибка обновления анкеты');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoadingForm) {
        return (
            <div className="container text-center" style={{ padding: '2rem' }}>
                <h3>Загрузка анкеты...</h3>
            </div>
        );
    }

    if (error && !form) {
        return (
            <div className="container">
                <div className="card text-center">
                    <h3>Ошибка</h3>
                    <p style={{ color: '#dc3545', marginBottom: '1rem' }}>{error}</p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="btn btn-primary"
                    >
                        Вернуться к списку анкет
                    </button>
                </div>
            </div>
        );
    }

    if (!form) {
        return (
            <div className="container">
                <div className="card text-center">
                    <h3>Анкета не найдена</h3>
                    <p style={{ color: '#666', marginBottom: '1rem' }}>
                        Анкета с указанным ID не существует или у вас нет прав на её просмотр
                    </p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="btn btn-primary"
                    >
                        Вернуться к списку анкет
                    </button>
                </div>
            </div>
        );
    }

    const initialData: Partial<CreateFormData> = {
        first_name: form.first_name,
        last_name: form.last_name,
        middle_name: form.middle_name || '',
        iin: form.iin,
        gender_id: form.gender_id,
        birth_date: form.birth_date,
        phone: form.phone,
        programming_language_id: form.programming_language_id || undefined,
        custom_programming_language: form.custom_programming_language || '',
    };

    return (
        <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="btn btn-secondary"
                    style={{ padding: '0.5rem 1rem' }}
                >
                    ← Назад
                </button>
                <h2>Редактирование анкеты</h2>
            </div>

            {error && (
                <div
                    className="form-error mb-3"
                    style={{
                        textAlign: 'center',
                        padding: '0.75rem',
                        backgroundColor: '#f8d7da',
                        borderRadius: '4px',
                        maxWidth: '600px',
                        margin: '0 auto 1rem'
                    }}
                >
                    {error}
                    <button
                        onClick={() => setError('')}
                        style={{
                            background: 'none',
                            border: 'none',
                            float: 'right',
                            cursor: 'pointer',
                            fontSize: '1.2rem',
                        }}
                    >
                        ×
                    </button>
                </div>
            )}

            <FormBuilder
                onSubmit={handleSubmit}
                initialData={initialData}
                isLoading={isLoading}
                submitText="Сохранить изменения"
            />
        </div>
    );
};

export default EditFormPage;