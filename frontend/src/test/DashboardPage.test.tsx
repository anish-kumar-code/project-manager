import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { AuthProvider } from '@/context/auth-context';
import { AppThemeProvider } from '@/context/theme-context';
import api from '@/services/api';
import { vi } from 'vitest';
import React from 'react';
import DashboardPage from '../pages/dashboard-page';

// --- THE GUARANTEED FIX ---
// Mock the antd library. We keep all its original parts, but replace Popconfirm.
vi.mock('antd', async (importOriginal) => {
  const antd = await importOriginal<typeof import('antd')>();
  
  // Our MockedPopconfirm will take the 'onConfirm' function and call it immediately
  // when its child (the delete button) is clicked.
  const MockedPopconfirm = (props: any) => {
    return React.cloneElement(React.Children.only(props.children), {
      onClick: props.onConfirm,
    });
  };
  
  return {
    ...antd,
    Popconfirm: MockedPopconfirm, // Use our mock instead of the real one
  };
});


// Helper to wrap components in all necessary providers
const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <MemoryRouter>
      <AuthProvider>
        <AppThemeProvider>{component}</AppThemeProvider>
      </AuthProvider>
    </MemoryRouter>
  );
};

// Mock data to return from the API
const mockProjects = [
  { _id: '1', key: '1', title: 'First Mock Project', description: 'Desc 1', status: 'active' },
  { _id: '2', key: '2', title: 'Second Mock Project', description: 'Desc 2', status: 'active' },
];

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.spyOn(api, 'get').mockResolvedValue({
      data: {
        data: {
          projects: mockProjects,
          pagination: { totalProjects: 2, currentPage: 1 },
        },
      },
    });
  });

  afterEach(() => {
    // Clear mocks, but do not restore them, to keep our Popconfirm mock active
    vi.clearAllMocks();
  });


  test('should render projects fetched from the API', async () => {
    renderWithProviders(<DashboardPage />);
    expect(await screen.findByText('First Mock Project')).toBeInTheDocument();
  });

  // This test should now work correctly
  test('should open the "Add Project" modal and allow form submission', async () => {
    const user = userEvent.setup();
    const postSpy = vi.spyOn(api, 'post').mockResolvedValue({ data: {} });
    renderWithProviders(<DashboardPage />);
    
    await user.click(screen.getByRole('button', { name: /Add Project/i }));
    
    const titleInput = await screen.findByLabelText(/Project Title/i);
    await user.type(titleInput, 'New Test Project');
    
    const descriptionInput = screen.getByLabelText(/Project Description/i);
    await user.type(descriptionInput, 'A test description.');
    
    await user.click(screen.getByRole('button', { name: /Create/i }));

    await waitFor(() => {
      expect(postSpy).toHaveBeenCalledWith('/projects', { title: 'New Test Project', description: 'A test description.' });
    });
  });

  // This test should also now work correctly
  test('should open the edit modal and submit changes', async () => {
    const user = userEvent.setup();
    const patchSpy = vi.spyOn(api, 'patch').mockResolvedValue({ data: { data: {} } });
    renderWithProviders(<DashboardPage />);
    
    const projectRow = await screen.findByText('First Mock Project');
    const editButton = within(projectRow.closest('tr')!).getByRole('button', { name: /edit/i });
    
    await user.click(editButton);

    const titleInput = await screen.findByLabelText(/Project Title/i);
    await user.clear(titleInput);
    await user.type(titleInput, 'Updated Project Title');
    
    await user.click(screen.getByRole('button', { name: /Save Changes/i }));

    await waitFor(() => {
        expect(patchSpy).toHaveBeenCalledWith('/projects/1', expect.objectContaining({ title: 'Updated Project Title' }));
    });
  });

  // --- THE SIMPLIFIED DELETE TEST ---
  test('should call the delete API when delete button is clicked', async () => {
    const user = userEvent.setup();
    const deleteSpy = vi.spyOn(api, 'delete').mockResolvedValue({ data: {} });
    renderWithProviders(<DashboardPage />);

    const projectRow = await screen.findByText('Second Mock Project');
    const deleteButton = within(projectRow.closest('tr')!).getByRole('button', { name: /delete/i });

    // Click the delete button once. Our mock calls onConfirm immediately.
    await user.click(deleteButton);
    
    // Assert that the DELETE API was called.
    await waitFor(() => {
        expect(deleteSpy).toHaveBeenCalledWith('/projects/2');
    });
  });
});