import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { AuthProvider } from '@/context/auth-context';

import api from '@/services/api'; 
import { vi } from 'vitest'; 
import LoginPage from '../pages/login-page';


vi.mock('@/services/api');

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <MemoryRouter>
      <AuthProvider>{component}</AuthProvider>
    </MemoryRouter>
  );
};

describe('LoginPage', () => {
  beforeEach(() => {
    vi.spyOn(api, 'get').mockRejectedValue(new Error('Not Authenticated'));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('renders the login form correctly', async () => {
    renderWithProviders(<LoginPage />);

    const titleElement = await screen.findByRole('heading', { name: /Login/i });

    expect(titleElement).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Log in/i })).toBeInTheDocument();
  });
});