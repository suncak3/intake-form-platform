import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form } from '../../types';
import { apiService } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import FormList from '../../components/forms/FormList';
import Modal from '../../components/common/Modal';
import FormView from '../../components/forms/FormView';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const DashboardPage: React.FC = () => {
    const [forms, setForms] = useState<Form[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedForm, setSelectedForm] = useState<Form | null>(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [formToDelete, setFormToDelete] = useState<number | null>(null);
    const [error, setError] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');

    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.state?.message) {
            setSuccessMessage(location.state.message);
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    useEffect(() => {
        const loadForms = async () => {
            try {
                const response = await apiService.getMyForms();
                setForms(response.forms);
            } catch (error: any) {
                setError(error.response?.data?.error || 'Ошибка загрузки анкет');
            } finally {
                setIsLoading(false);
            }
        };

        loadForms();
    }, []);

    const handleViewForm = (form: Form) => {
        setSelectedForm(form);
        setShowViewModal(true);
    };

    const handleEditForm = (form: Form) => {
        navigate(`/edit-form/${form.id}`);
    };

    const handleDeleteForm = (formId: number) => {
        setFormToDelete(formId);
        setShowDeleteDialog(true);
    };

    const confirmDeleteForm = async () => {
        if (!formToDelete) return;

        try {
            await apiService.deleteMyForm(formToDelete);
            setForms(forms.filter(form => form.id !== formToDelete));
            setSuccessMessage('Анкета успешно удалена');
            setFormToDelete(null);
        } catch (error: any) {
            setError(error.response?.data?.error || 'Ошибка удаления анкеты');
        }
    };

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Личный кабинет</h2>
                <Link to="/create-form" className="btn btn-primary">
                    + Создать анкету
                </Link>
            </div>

            {user && (
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h3>Информация о профиле</h3>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Роль:</strong> Пользователь</p>
                    <p><strong>Количество анкет:</strong> {forms.length}</p>
                </div>
            )}

            {successMessage && (
                <div
                    style={{
                        padding: '0.75rem',
                        backgroundColor: '#d4edda',
                        color: '#155724',
                        border: '1px solid #c3e6cb',
                        borderRadius: '4px',
                        marginBottom: '1rem',
                    }}
                >
                    {successMessage}
                    <button
                        onClick={() => setSuccessMessage('')}
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

            <FormList
                forms={forms}
                onView={handleViewForm}
                onEdit={handleEditForm}
                onDelete={handleDeleteForm}
                isLoading={isLoading}
            />

            <Modal
                isOpen={showViewModal}
                onClose={() => setShowViewModal(false)}
                title={selectedForm ? `Анкета: ${selectedForm.first_name} ${selectedForm.last_name}` : ''}
                size="large"
            >
                {selectedForm && <FormView form={selectedForm} />}
            </Modal>

            <ConfirmDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={confirmDeleteForm}
                title="Подтверждение удаления"
                message="Вы уверены, что хотите удалить эту анкету? Это действие нельзя отменить."
                confirmText="Удалить"
                cancelText="Отмена"
                type="danger"
            />
        </div>
    );
};

export default DashboardPage;