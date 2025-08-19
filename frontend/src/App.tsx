import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import AdminLoginPage from './pages/auth/AdminLoginPage';
import CreateFormPage from './pages/user/createFormPage';
import DashboardPage from './pages/user/DashboardPage';
import EditFormPage from './pages/user/EditFormPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminForms from './pages/admin/AdminForms';
import './styles/index.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <Navbar />
                    <main>
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/admin-login" element={<AdminLoginPage />} />

                            {/* Пользовательские роуты */}
                            <Route
                                path="/create-form"
                                element={
                                    <ProtectedRoute>
                                        <CreateFormPage />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/dashboard"
                                element={
                                    <ProtectedRoute>
                                        <DashboardPage />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Админские роуты */}
                            <Route
                                path="/admin/dashboard"
                                element={
                                    <ProtectedRoute requireAdmin>
                                       <AdminDashboard />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/admin/users"
                                element={
                                    <ProtectedRoute requireAdmin>
                                        <AdminUsers />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="/admin/forms"
                                element={
                                    <ProtectedRoute requireAdmin>
                                        <AdminForms />
                                    </ProtectedRoute>
                                }
                            />


                            <Route
                                path="/edit-form/:id"
                                element={
                                    <ProtectedRoute>
                                        <EditFormPage />
                                    </ProtectedRoute>
                                }
                            />

                            <Route
                                path="*"
                                element={
                                    <div className="container text-center" style={{ padding: '2rem' }}>
                                        <h2>Страница не найдена</h2>
                                        <a href="/">Вернуться на главную</a>
                                    </div>
                                }
                            />
                        </Routes>
                    </main>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;