import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormBuilder from '../../components/forms/FormBuilder';
import { CreateFormData } from '../../types';
import { apiService } from '../../services/api';

const CreateFormPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    const handleSubmit = async (data: CreateFormData) => {
        setIsLoading(true);
        setError('');

        try {
            await apiService.createForm(data);
            navigate('/dashboard', {
                state: { message: 'Анкета успешно создана!' }
            });
        } catch (err: any) {
            setError(err.response?.data?.error || 'Ошибка создания анкеты');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container">
            <h2 className="text-center mb-4">Создание анкеты</h2>

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
                </div>
            )}

            <FormBuilder
                onSubmit={handleSubmit}
                isLoading={isLoading}
                submitText="Создать анкету"
            />
        </div>
    );
};

export default CreateFormPage;