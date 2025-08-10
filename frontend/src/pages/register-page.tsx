import { Card, Form, Input, Button, Typography, message, Spin } from 'antd';
import { Link, Navigate, useNavigate } from 'react-router';
import api from '@/services/api';
import { useState } from 'react';
import { useAuth } from '../context/auth-context';

const { Title, Text } = Typography;

const RegisterPage = () => {
    const [loading, setLoading] = useState(false);
    const { user, isLoading } = useAuth();
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();

    // --- Redirection Logic ---
    if (isLoading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Spin size="large" /></div>;
    }

    if (user) {
        return <Navigate to="/" replace />;
    }

    const onFinish = async (values: any) => {

        const data = {
            fullName: values.fullName,
            email: values.email,
            password: values.password
        }
        setLoading(true);
        try {
            await api.post('/users/register', data);
            messageApi.success('Registration successful! Please log in.');
            navigate('/login');
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Registration failed.';
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
                    Create an Account
                </Title>
                <Form name="register" onFinish={onFinish} layout="vertical" autoComplete="off">
                    <Form.Item name="fullName" label="Full Name" rules={[{ required: true, message: 'Please input your full name!', whitespace: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label="E-mail" rules={[{ type: 'email', message: 'The input is not a valid E-mail!' }, { required: true, message: 'Please input your E-mail!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Please input your password!' }]} hasFeedback>
                        <Input.Password />
                    </Form.Item>
                    <Form.Item name="confirm" label="Confirm Password" dependencies={['password']} hasFeedback rules={[{ required: true, message: 'Please confirm your password!' }, ({ getFieldValue }) => ({ validator(_, value) { if (!value || getFieldValue('password') === value) { return Promise.resolve(); } return Promise.reject(new Error('The two passwords that you entered do not match!')); }, })]}>
                        <Input.Password />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
                            Register
                        </Button>
                    </Form.Item>
                    <Text style={{ textAlign: 'center', display: 'block' }}>
                        Already have an account? <Link to="/login">Log in</Link>
                    </Text>
                </Form>
            </Card>
        </div>
    );
};

export default RegisterPage;