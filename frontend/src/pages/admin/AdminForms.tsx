import React, { useState, useEffect } from 'react';
import { Form } from '../../types';
import { apiService } from '../../services/api';
import FormList from '../../components/forms/FormList';
import Modal from '../../components/common/Modal';
import FormView from '../../components/forms/FormView';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import FormBuilder from '../../components/forms/FormBuilder';
import { CreateFormData } from '../../types';

const AdminForms: React.FC = () => {
    const [forms, setForms] = useState<Form[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [total, setTotal] = useState(0);

    const [selectedForm, setSelectedForm] = useState<Form | null>(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [formToDelete, setFormToDelete] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const loadForms = async (page: number = 1) => {
        setIsLoading(true);
        try {
            const response = await apiService.getAllForms(page, 10);
            setForms(response.forms);
            setCurrentPage(response.page);
            setTotalPages(response.totalPages);
            setTotal(response.total);
        } catch (error: any) {
            setError(error.response?.data?.error || 'Ошибка загрузки анкет');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadForms();
    }, []);

    const handlePageChange = (page: number) => {
        loadForms(page);
    };

    const handleViewForm = (form: Form) => {
        setSelectedForm(form);
        setShowViewModal(true);
    };

    const handleEditForm = (form: Form) => {
        setSelectedForm(form);
        setShowEditModal(true);
    };

    const handleDeleteForm = (formId: number) => {
        setFormToDelete(formId);
        setShowDeleteDialog(true);
    };

    const confirmDeleteForm = async () => {
        if (!formToDelete) return;

        try {
            await apiService.deleteFormAdmin(formToDelete);
            setForms(forms.filter(form => form.id !== formToDelete));
            setSuccessMessage('Анкета успешно удалена');
            setFormToDelete(null);
            setTotal(total - 1);
        } catch (error: any) {
            setError(error.response?.data?.error || 'Ошибка удаления анкеты');
        }
    };

    const handleEditSubmit = async (data: CreateFormData) => {
        if (!selectedForm) return;

        setIsSubmitting(true);
        setError('');

        try {
            const response = await apiService.updateFormAdmin(selectedForm.id, data);

            setForms(forms.map(form =>
                form.id === selectedForm.id ? response.form : form
            ));

            setSuccessMessage('Анкета успешно обновлена');
            setShowEditModal(false);
            setSelectedForm(null);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Ошибка обновления анкеты');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading && forms.length === 0) {
        return (
            <div className="container text-center" style={{ padding: '2rem' }}>
                <h3>Загрузка анкет...</h3>
            </div>
        );
    }

    const getInitialData = (form: Form): Partial<CreateFormData> => ({
        first_name: form.first_name,
        last_name: form.last_name,
        middle_name: form.middle_name || '',
        iin: form.iin,
        gender_id: form.gender_id,
        birth_date: form.birth_date,
        phone: form.phone,
        programming_language_id: form.programming_language_id || undefined,
        custom_programming_language: form.custom_programming_language || '',
    });

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Управление анкетами</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ color: '#666' }}>Всего: {total} анкет</span>
                </div>
            </div>

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

            {forms.length === 0 ? (
                <div className="card text-center">
                    <h3>Анкет пока нет</h3>
                    <p style={{ color: '#666' }}>В системе еще не создано ни одной анкеты</p>
                </div>
            ) : (
                <>
                    <FormList
                        forms={forms}
                        onView={handleViewForm}
                        onEdit={handleEditForm}
                        onDelete={handleDeleteForm}
                        isLoading={false}
                        showActions={true}
                    />

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

            <Modal
                isOpen={showViewModal}
                onClose={() => setShowViewModal(false)}
                title={selectedForm ? `Анкета: ${selectedForm.first_name} ${selectedForm.last_name}` : ''}
                size="large"
            >
                {selectedForm && (
                    <div>
                        <FormView form={selectedForm} />

                        <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
                            <h4 style={{ color: '#856404' }}>Административная информация</h4>
                            <p><strong>ID анкеты:</strong> {selectedForm.id}</p>
                            {selectedForm.user ? (
                                <p><strong>Владелец:</strong> {selectedForm.user.email} (ID: {selectedForm.user.id})</p>
                            ) : (
                                <p><strong>Владелец:</strong> Анонимная анкета</p>
                            )}
                        </div>

                        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => {
                                    setShowViewModal(false);
                                    setTimeout(() => handleEditForm(selectedForm), 100);
                                }}
                                className="btn btn-primary"
                            >
                                Редактировать
                            </button>
                            <button
                                onClick={() => {
                                    setShowViewModal(false);
                                    setTimeout(() => handleDeleteForm(selectedForm.id), 100);
                                }}
                                className="btn btn-danger"
                            >
                                🗑️ Удалить
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            <Modal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                title={selectedForm ? `Редактирование анкеты: ${selectedForm.first_name} ${selectedForm.last_name}` : ''}
                size="large"
            >
                {selectedForm && (
                    <div>
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

                        <FormBuilder
                            onSubmit={handleEditSubmit}
                            initialData={getInitialData(selectedForm)}
                            isLoading={isSubmitting}
                            submitText="Сохранить изменения"
                        />
                    </div>
                )}
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

export default AdminForms;