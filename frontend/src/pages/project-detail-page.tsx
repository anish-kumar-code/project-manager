import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Card, Typography, Spin, message, List, Button, Tag, Descriptions, Modal, Form, Input, Select, DatePicker, Popconfirm, Pagination, Empty } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Project, Task } from '@/types';
import api from '@/services/api';
import { useDebounce } from '@/hooks/use-debounce';
import dayjs from 'dayjs';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { Search } = Input;

const ProjectDetailPage = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();
    const [form] = Form.useForm();

    // --- State Management ---
    const [project, setProject] = useState<Project | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);

    // Separate loading states for clarity
    const [projectLoading, setProjectLoading] = useState(true);
    const [tasksLoading, setTasksLoading] = useState(true);

    // State for task search and pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalTasks, setTotalTasks] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const pageSize = 10; 

    // State for the Create/Edit Task modal
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    // --- Data Fetching ---
    const fetchTasks = async (page: number, search: string) => {
        if (!projectId) return;
        setTasksLoading(true);
        try {
            const response = await api.get(`/projects/${projectId}/tasks`, {
                params: { page, limit: pageSize, search },
            });
            const { tasks, pagination } = response.data.data;
            setTasks(tasks);
            setTotalTasks(pagination.totalTasks);
        } catch (error) {
            message.error('Failed to load tasks.');
        } finally {
            setTasksLoading(false);
        }
    };

    // Effect for fetching the main project details
    useEffect(() => {
        const fetchProject = async () => {
            if (!projectId) {
                navigate('/');
                return;
            }
            setProjectLoading(true);
            try {
                const response = await api.get(`/projects/${projectId}`);
                setProject(response.data.data);
            } catch (error) {
                message.error('Failed to load project details.');
            } finally {
                setProjectLoading(false);
            }
        };
        fetchProject();
    }, [projectId, navigate]);

    useEffect(() => {
        fetchTasks(currentPage, debouncedSearchTerm);
    }, [projectId, currentPage, debouncedSearchTerm]);

    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearchTerm]);

    // --- Modal and CRUD Handlers ---
    const showCreateModal = () => { setEditingTask(null); form.resetFields(); setIsModalVisible(true); };
    const showEditModal = (task: Task) => { setEditingTask(task); form.setFieldsValue({ ...task, dueDate: task.dueDate ? dayjs(task.dueDate) : null }); setIsModalVisible(true); };
    const handleCancel = () => { setIsModalVisible(false); };

    const handleFormSubmit = async (values: any) => {
        setModalLoading(true);
        const apiCall = editingTask ? api.patch(`/projects/${projectId}/tasks/${editingTask._id}`, values) : api.post(`/projects/${projectId}/tasks`, values);
        try {
            await apiCall;
            message.success(`Task ${editingTask ? 'updated' : 'created'} successfully!`);
            handleCancel();
            fetchTasks(currentPage, debouncedSearchTerm); // Re-fetch tasks to show changes
        } catch (error) {
            message.error(`Failed to ${editingTask ? 'update' : 'create'} task.`);
        } finally {
            setModalLoading(false);
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        try {
            await api.delete(`/projects/${projectId}/tasks/${taskId}`);
            message.success('Task deleted successfully!');
            fetchTasks(currentPage, debouncedSearchTerm);
        } catch (error) {
            message.error('Failed to delete task.');
        }
    };

    // ... (getStatusTagColor function remains the same)
    const getStatusTagColor = (status: Task['status']) => { switch (status) { case 'todo': return 'gold'; case 'in-progress': return 'blue'; case 'done': return 'green'; default: return 'default'; } };

    if (projectLoading) {
        return <div className="text-center p-12"><Spin size="large" /></div>;
    }
    if (!project) {
        return <Card><p>Project not found.</p></Card>;
    }

    return (
        <div className="flex flex-col gap-6">
            <Card>
                <Descriptions title={<Title level={2}>{project.title}</Title>} bordered></Descriptions>
                <p>Description: {project.description}</p>
                <p>Status: {project.status}</p>
            </Card>

            <Card>
                <div className="flex justify-between items-center mb-6">
                    <Title level={3} className="m-0">Tasks</Title>
                    <Button type="primary" icon={<PlusOutlined />} onClick={showCreateModal}>Create Task</Button>
                </div>
                <Search
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    loading={tasksLoading && searchTerm === debouncedSearchTerm}
                    className="mb-6"
                />
                {tasksLoading ? <div className="text-center p-12"><Spin /></div> : (
                    <>
                        <List
                            itemLayout="horizontal"
                            dataSource={tasks}
                            renderItem={(task) => (
                                <List.Item
                                    actions={[
                                        <Button type="text" icon={<EditOutlined />} onClick={() => showEditModal(task)} />,
                                        <Popconfirm title="Delete the task" description="Are you sure?" onConfirm={() => handleDeleteTask(task._id)} okText="Yes" cancelText="No">
                                            <Button type="text" danger icon={<DeleteOutlined />} />
                                        </Popconfirm>,
                                    ]}
                                >
                                    <List.Item.Meta title={task.title} description={task.dueDate ? `Due: ${new Date(task.dueDate).toLocaleDateString()}` : 'No due date'} />
                                    <Tag color={getStatusTagColor(task.status)}>{task.status.replace('-', ' ').toUpperCase()}</Tag>
                                </List.Item>
                            )}
                        />
                        {totalTasks === 0 && <Empty description="No tasks found." />}
                        {totalTasks > pageSize && (
                            <div className="flex justify-end mt-6">
                                <Pagination current={currentPage} total={totalTasks} pageSize={pageSize} onChange={(page) => setCurrentPage(page)} showSizeChanger={false} />
                            </div>
                        )}
                    </>
                )}
            </Card>

            <Modal
                title={editingTask ? 'Edit Task' : 'Create Task'}
                open={isModalVisible}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>Cancel</Button>,
                    <Button key="submit" type="primary" loading={modalLoading} onClick={() => form.submit()}>
                        {editingTask ? 'Save Changes' : 'Create'}
                    </Button>,
                ]}
            >
                <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
                    <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Description">
                        <TextArea rows={4} />
                    </Form.Item>
                    {
                        editingTask && (
                            <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                                <Select>
                                    <Option value="todo">To Do</Option>
                                    <Option value="in-progress">In Progress</Option>
                                    <Option value="done">Done</Option>
                                </Select>
                            </Form.Item>
                        )
                    }

                    <Form.Item name="dueDate" label="Due Date">
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ProjectDetailPage;