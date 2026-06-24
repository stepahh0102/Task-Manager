import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm } from './components/Auth/LoginForm';
import { RegisterForm } from './components/Auth/RegisterForm';
import { TasksPage } from './pages/TasksPage';
import { Dashboard } from './pages/Dashboard';
import { CreateTaskPage } from './pages/CreateTaskPage';
import { MessagesPage } from './pages/MessagesPage';
import { AdminPage } from './pages/AdminPage';
import { ProfilePage } from './pages/ProfilePage';
import { Layout } from './components/layout/Layout';

function App() {
return (
<Routes>
    <Route path="/login" element={<LoginForm />} />
    <Route path="/register" element={<RegisterForm />} />
    <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/tasks/new" element={<CreateTaskPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin" element={<AdminPage />} />
    </Route>

    <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
);
}

export default App;