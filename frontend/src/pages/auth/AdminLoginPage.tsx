import React from 'react';
import AuthForm from '../../components/forms/AuthForm';

const AdminLoginPage: React.FC = () => {
    return <AuthForm mode="admin" title="Вход администратора" />;
};

export default AdminLoginPage;