import { createBrowserRouter, RouterProvider } from 'react-router';
import AppLayout from './components/layout/app-layout';
import DashboardPage from './pages/dashboard-page';
import LoginPage from './pages/login-page';
import RegisterPage from './pages/register-page';
import ProtectedRoute from './components/protected-route'; // <-- IMPORT
import ProjectDetailPage from './pages/project-detail-page';

// Define the application's routes
const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'project/:projectId',
        element: <ProjectDetailPage />,
      }
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;