import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { AuthProvider } from '@/context/auth-context';

import api from '@/services/api'; // Import the real api
import { vi } from 'vitest'; // Import vitest's mock utilities
import LoginPage from '../pages/login-page';

// 1. Tell Vitest to mock our api service module
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
    // 2. Before each test, mock the 'get' method to simulate a logged-out user
    // We make it reject, so the AuthProvider sets user to null and loading to false.
    vi.spyOn(api, 'get').mockRejectedValue(new Error('Not Authenticated'));
  });

  afterEach(() => {
    // Clean up mocks after each test
    vi.restoreAllMocks();
  });

  // 3. Make the test function async
  test('renders the login form correctly', async () => {
    renderWithProviders(<LoginPage />);

    // 4. Use "findByRole" which waits for the loading spinner to disappear
    // and for the heading to appear.
    const titleElement = await screen.findByRole('heading', { name: /Login/i });

    // Assertions will now run AFTER the component has finished loading
    expect(titleElement).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Log in/i })).toBeInTheDocument();
  });
});