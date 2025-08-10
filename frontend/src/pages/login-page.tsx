import { Card, Form, Input, Button, Typography, message, Spin } from 'antd';
import { Link, Navigate, useNavigate } from 'react-router';
import { useAuth } from '@/context/auth-context';
import api from '@/services/api';
import { useState } from 'react';

const { Title, Text } = Typography;

const LoginPage = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { user, setUser, isLoading } = useAuth();
    const [messageApi, contextHolder] = message.useMessage();

    // --- Redirection Logic ---
    if (isLoading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Spin size="large" /></div>;
    }

    if (user) {
        return <Navigate to="/" replace />;
    }

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const response = await api.post('/users/login', values);
            if (response.data.success) {
                setUser(response.data.data.user);
                messageApi.success('Login successful!');
                navigate('/');
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Login failed.';
            messageApi.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            {contextHolder}
            <Card style={{ width: 400 }}>
                <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>
                    Login
                </Title>
                <Form name="login" onFinish={onFinish} layout="vertical" autoComplete="off">
                    {/* ... Form.Items are unchanged ... */}
                    <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'Please enter a valid email!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
                        <Input.Password />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
                            Log in
                        </Button>
                    </Form.Item>
                    <Text style={{ textAlign: 'center', display: 'block' }}>
                        Don't have an account? <Link to="/register">Register now!</Link>
                    </Text>
                </Form>
            </Card>
        </div>
    );
};

export default LoginPage;