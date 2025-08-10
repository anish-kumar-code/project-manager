import { Layout, Typography, Dropdown, Avatar, message } from 'antd';
import type { MenuProps } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useAuth } from '@/context/auth-context';
import { Outlet, useNavigate } from 'react-router';
import api from '@/services/api';

const { Header, Content } = Layout;
const { Title } = Typography;

const AppLayout = () => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await api.post('/users/logout');
            setUser(null);
            message.success('Logged out successfully');
            navigate('/login');
        } catch (error) {
            message.error('Logout failed. Please try again.');
        }
    };

    const getUserInitials = (name: string = '') => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    // The dropdown menu now only contains the logout option
    const items: MenuProps['items'] = [
        {
            key: 'logout',
            label: 'Logout',
            icon: <LogoutOutlined />,
            onClick: handleLogout,
            danger: true,
        },
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>
                <Title level={3} style={{ color: 'white', margin: 0 }}>
                    Project Manager
                </Title>
                <Dropdown menu={{ items }} placement="bottomRight" arrow>
                    <Avatar style={{ cursor: 'pointer', backgroundColor: '#1677ff' }} icon={<UserOutlined />}>
                        {user ? getUserInitials(user.fullName) : ''}
                    </Avatar>
                </Dropdown>
            </Header>
            <Content style={{ padding: '24px 48px' }}>
                <Outlet />
            </Content>
        </Layout>
    );
};

export default AppLayout;