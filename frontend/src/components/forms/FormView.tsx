import React from 'react';
import { Form } from '../../types';

interface FormViewProps {
    form: Form;
}

const FormView: React.FC<FormViewProps> = ({ form }) => {
    return (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                <div>
                    <h4>Личные данные</h4>
                    <p><strong>Имя:</strong> {form.first_name}</p>
                    <p><strong>Фамилия:</strong> {form.last_name}</p>
                    {form.middle_name && <p><strong>Отчество:</strong> {form.middle_name}</p>}
                    <p><strong>ИИН:</strong> {form.iin}</p>
                    <p><strong>Пол:</strong> {form.gender?.name || 'Не указан'}</p>
                </div>

                <div>
                    <h4>Контактная информация</h4>
                    <p><strong>Телефон:</strong> {form.phone}</p>

                    <h4 style={{ marginTop: '1.5rem' }}>Дополнительно</h4>
                    {form.programming_language?.name ? (
                        <p><strong>Язык программирования:</strong> {form.programming_language.name}</p>
                    ) : form.custom_programming_language ? (
                        <p><strong>Язык программирования:</strong> {form.custom_programming_language} (пользовательский)</p>
                    ) : (
                        <p><strong>Язык программирования:</strong> Не указан</p>
                    )}
                </div>
            </div>

            <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                <h4>Информация о записи</h4>
                <p><strong>ID анкеты:</strong> {form.id}</p>
                {form.user && <p><strong>Владелец:</strong> {form.user.email}</p>}
            </div>
        </div>
    );
};

export default FormView;