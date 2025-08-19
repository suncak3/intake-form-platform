import React from 'react';
import Modal from './Modal';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
                                                         isOpen,
                                                         onClose,
                                                         onConfirm,
                                                         title,
                                                         message,
                                                         confirmText = 'Подтвердить',
                                                         cancelText = 'Отмена',
                                                         type = 'danger',
                                                     }) => {
    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    const buttonClass = type === 'danger' ? 'btn-danger' :
        type === 'warning' ? 'btn-secondary' : 'btn-primary';

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} size="small">
            <div>
                <p style={{ marginBottom: '1.5rem' }}>{message}</p>

                <div className="d-flex justify-content-between gap-2">
                    <button
                        onClick={onClose}
                        className="btn btn-secondary"
                        style={{ flex: 1 }}
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={handleConfirm}
                        className={`btn ${buttonClass}`}
                        style={{ flex: 1 }}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmDialog;