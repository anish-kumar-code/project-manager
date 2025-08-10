import { useState, useEffect, useCallback } from "react";
import { Card, Button, Table, Modal, Form, Input, message, Popconfirm, Space, Tag, Select, Tooltip } from "antd";
import { PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Link } from "react-router";
import type { Project } from "@/types";
import api from "@/services/api";
import { useDebounce } from "@/hooks/use-debounce";

const { TextArea } = Input;
const { Search } = Input;

const DashboardPage = () => {
    // --- State Management ---
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalProjects, setTotalProjects] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [form] = Form.useForm();
    const pageSize = 10;

    // --- Data Fetching ---
    const fetchProjects = useCallback(
        async (page: number, search: string) => {
            setLoading(true);
            try {
                const response = await api.get("/projects", {
                    params: { page, limit: pageSize, search },
                });
                const projectsWithKeys = response.data.data.projects.map(
                    (p: Project) => ({ ...p, key: p._id })
                );
                setProjects(projectsWithKeys);
                setTotalProjects(response.data.data.pagination.totalProjects);
            } catch (error) {
                message.error("Failed to fetch projects.");
            } finally {
                setLoading(false);
            }
        },
        [pageSize]
    );

    useEffect(() => {
        fetchProjects(currentPage, debouncedSearchTerm);
    }, [currentPage, debouncedSearchTerm, fetchProjects]);

    // --- Handlers ---
    const showCreateModal = () => {
        setEditingProject(null);
        form.resetFields();
        setIsModalVisible(true);
    };
    const showEditModal = (project: Project) => {
        setEditingProject(project);
        form.setFieldsValue({
            title: project.title,
            description: project.description,
            status: project.status,
        });
        setIsModalVisible(true);
    };
    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingProject(null);
        form.resetFields();
    };

    const handleDeleteProject = async (projectId: string) => {
        try {
            await api.delete(`/projects/${projectId}`);
            message.success("Project deleted successfully");
            fetchProjects(currentPage, debouncedSearchTerm);
        } catch (error) {
            message.error("Failed to delete project.");
        }
    };

    const handleFormSubmit = async (values: { title: string; description: string; status: string }) => {
        setModalLoading(true);
        const apiCall = editingProject
            ? api.patch(`/projects/${editingProject._id}`, values)
            : api.post("/projects", values);
        try {
            await apiCall;
            message.success(`Project ${editingProject ? "updated" : "created"} successfully!`);
            handleCancel();
            // Always re-fetch the current page for consistency after any change
            fetchProjects(currentPage, debouncedSearchTerm);
        } catch (error) {
            message.error(`Failed to ${editingProject ? "update" : "create"} project.`);
        } finally {
            setModalLoading(false);
        }
    };

    // --- Table Column Definitions ---
    const columns = [
        { title: "Sr. No.", key: "srNo", render: (_: any, _record: Project, index: number) => (currentPage - 1) * pageSize + index + 1 },
        { title: "Project Name", dataIndex: "title", key: "title", render: (text: string, record: Project) => <Link to={`/project/${record._id}`}>{text}</Link> },
        { title: "Project Status", dataIndex: "status", key: "status", render: (text: string) => <Tag color={text === "completed" ? "green" : "blue"}>{text}</Tag> },
        {
            title: "Task Count", key: "taskCount", render: (_: any, record: Project) => (
                <Space wrap>
                    <Tag>Total: {record.totalTasks}</Tag>
                    <Tag color="gold">To Do: {record.todoTasks}</Tag>
                    <Tag color="blue">In Progress: {record.inProgressTasks}</Tag>
                    <Tag color="green">Done: {record.doneTasks}</Tag>
                </Space>
            )
        },
        {
            title: "Action", key: "action", render: (_: any, record: Project) => (
                <Space size="middle">
                    <Tooltip title="View Project"><Link to={`/project/${record._id}`}><Button icon={<EyeOutlined />} /></Link></Tooltip>
                    <Tooltip title="Edit Project"><Button icon={<EditOutlined />} onClick={() => showEditModal(record)} /></Tooltip>
                    <Tooltip title="Delete Project"><Popconfirm title="Sure to delete?" onConfirm={() => handleDeleteProject(record._id)}><Button danger icon={<DeleteOutlined />} /></Popconfirm></Tooltip>
                </Space>
            )
        },
    ];

    return (
        <>
            <Card variant="borderless"> {/* <-- FIX: Changed `bordered={false}` to `variant="borderless"` */}
                <div className="flex justify-between items-center mb-6">
                    <div className="w-1/3">
                        <Search placeholder="Search projects..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} enterButton />
                    </div>
                    <Button type="primary" icon={<PlusOutlined />} onClick={showCreateModal} size="large">
                        Add Project
                    </Button>
                </div>
                <Table
                    columns={columns}
                    dataSource={projects}
                    loading={loading}
                    pagination={{
                        current: currentPage,
                        pageSize: pageSize,
                        total: totalProjects,
                        onChange: (page) => setCurrentPage(page),
                        showSizeChanger: false,
                    }}
                />
            </Card>

            <Modal
                title={editingProject ? "Edit Project" : "Create Project"}
                open={isModalVisible}
                onCancel={handleCancel}
                destroyOnHidden // <-- FIX: Changed `destroyOnClose` to `destroyOnHidden`
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={handleFormSubmit} className="mt-6">
                    <Form.Item name="title" label="Project Title" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Project Description" rules={[{ required: true }]}>
                        <TextArea rows={4} />
                    </Form.Item>
                    {editingProject && (
                        <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                            <Select>
                                <Select.Option value="active">active</Select.Option> {/* <-- FIX: Used Select.Option */}
                                <Select.Option value="completed">completed</Select.Option> {/* <-- FIX: Used Select.Option */}
                            </Select>
                        </Form.Item>
                    )}
                    <Form.Item className="text-right">
                        <Button onClick={handleCancel} style={{ marginRight: "10px" }}>Cancel</Button>
                        <Button type="primary" htmlType="submit" loading={modalLoading}>
                            {editingProject ? 'Save Changes' : 'Create'}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default DashboardPage;