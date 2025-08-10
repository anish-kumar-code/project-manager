import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import { AuthProvider } from '@/context/auth-context';
import { AppThemeProvider } from '@/context/theme-context';
import api from '@/services/api';
import { vi } from 'vitest';
import ProjectDetailPage from '../pages/project-detail-page';

// Mock the API service
vi.mock('@/services/api');

const renderWithProviders = (projectId: string) => {
    return render(
        <MemoryRouter initialEntries={[`/project/${projectId}`]}>
            <AuthProvider>
                <AppThemeProvider>
                    <Routes>
                        <Route path="/project/:projectId" element={<ProjectDetailPage />} />
                    </Routes>
                </AppThemeProvider>
            </AuthProvider>
        </MemoryRouter>
    );
};

// Mock data for our tests
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

        // --- THE FIX: Use a single 'waitFor' to check for all elements ---
        // This is more robust and ensures the component has finished all its state updates.
        await waitFor(() => {
            // Check for the project title
            expect(screen.getByText('Detailed Mock Project')).toBeInTheDocument();

            // Check for the description text
            expect(screen.getByText(/A very important project description/i)).toBeInTheDocument();

            // Check for a task from the list
            expect(screen.getByText('First Task')).toBeInTheDocument();
        });
    });

});