import React from 'react';
import AuthForm from '../../components/forms/AuthForm';

const LoginPage: React.FC = () => {
    return <AuthForm mode="login" title="Вход в систему" />;
};

export default LoginPage;