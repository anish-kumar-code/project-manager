import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import 'antd/dist/reset.css';
import './index.css'
import { AuthProvider } from './context/auth-context.tsx';
import { ConfigProvider } from 'antd';
import { AppThemeProvider } from './context/theme-context.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <ConfigProvider theme={antdConfig}> */}
    <AppThemeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </AppThemeProvider>
    {/* </ConfigProvider> */}
  </StrictMode>,
)
