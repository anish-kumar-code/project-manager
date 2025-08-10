export interface User {
    _id: string;
    fullName: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

export interface Project {
    _id: string;
    title: string;
    description: string;
    status: 'active' | 'completed';
    owner: string; // This will be the User's _id
    createdAt: string;
    updatedAt: string;
    totalTasks: number;
    todoTasks: number;
    inProgressTasks: number;
    doneTasks: number;
}

export interface Task {
    _id: string;
    title: string;
    description?: string;
    status: 'todo' | 'in-progress' | 'done';
    dueDate?: string;
    project: string; // Project's _id
    owner: string; // User's _id
    createdAt: string;
    updatedAt: string;
}

// type for API response
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}