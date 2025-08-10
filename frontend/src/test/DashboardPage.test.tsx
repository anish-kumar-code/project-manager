import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { AuthProvider } from '@/context/auth-context';
import api from '@/services/api';
import { vi } from 'vitest';
import React from 'react';
import DashboardPage from '../pages/dashboard-page';

vi.mock('antd', async (importOriginal) => {
  const antd = await importOriginal<typeof import('antd')>();

  const MockedPopconfirm = (props: any) => {
    return React.cloneElement(React.Children.only(props.children), {
      onClick: props.onConfirm,
    });
  };

  return {
    ...antd,
    Popconfirm: MockedPopconfirm,
  };
});


const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <MemoryRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </MemoryRouter>
  );
};

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
    vi.clearAllMocks();
  });


  test('should render projects fetched from the API', async () => {
    renderWithProviders(<DashboardPage />);
    expect(await screen.findByText('First Mock Project')).toBeInTheDocument();
  });

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

  test('should call the delete API when delete button is clicked', async () => {
    const user = userEvent.setup();
    const deleteSpy = vi.spyOn(api, 'delete').mockResolvedValue({ data: {} });
    renderWithProviders(<DashboardPage />);

    const projectRow = await screen.findByText('Second Mock Project');
    const deleteButton = within(projectRow.closest('tr')!).getByRole('button', { name: /delete/i });

    await user.click(deleteButton);

    await waitFor(() => {
      expect(deleteSpy).toHaveBeenCalledWith('/projects/2');
    });
  });
});