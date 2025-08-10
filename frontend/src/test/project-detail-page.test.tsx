import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import { AuthProvider } from '@/context/auth-context';
import api from '@/services/api';
import { vi } from 'vitest';
import ProjectDetailPage from '../pages/project-detail-page';

vi.mock('@/services/api');

const renderWithProviders = (projectId: string) => {
    return render(
        <MemoryRouter initialEntries={[`/project/${projectId}`]}>
            <AuthProvider>
                    <Routes>
                        <Route path="/project/:projectId" element={<ProjectDetailPage />} />
                    </Routes>
            </AuthProvider>
        </MemoryRouter>
    );
};

const mockProject = {
    _id: '1',
    title: 'Detailed Mock Project',
    description: 'A very important project description.',
    status: 'active',
};
const mockTasks = [
    { _id: 't1', title: 'First Task', status: 'todo' },
    { _id: 't2', title: 'Second Task', status: 'in-progress' },
];

describe('ProjectDetailPage', () => {

    beforeEach(() => {
        vi.spyOn(api, 'get').mockImplementation((url) => {
            if (url.includes('/tasks')) {
                return Promise.resolve({
                    data: { data: { tasks: mockTasks, pagination: { totalTasks: 2 } } },
                });
            }
            if (url.includes('/projects/')) {
                return Promise.resolve({ data: { data: mockProject } });
            }
            return Promise.reject(new Error('not found'));
        });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    test('should render project details and associated tasks correctly', async () => {
        renderWithProviders('1');

        await waitFor(() => {
            expect(screen.getByText('Detailed Mock Project')).toBeInTheDocument();

            expect(screen.getByText(/A very important project description/i)).toBeInTheDocument();

            expect(screen.getByText('First Task')).toBeInTheDocument();
        });
    });

});