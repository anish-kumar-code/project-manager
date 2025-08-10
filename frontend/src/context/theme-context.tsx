import React, { createContext, useState, useContext, ReactNode } from 'react';
import { ConfigProvider, theme as antdTheme } from 'antd';
import type { ThemeConfig } from 'antd';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// --- A professional color palette for LIGHT mode ---
const lightTheme: ThemeConfig = {
    token: {
        colorPrimary: '#1677ff', // A vibrant blue for primary actions
        colorBgLayout: '#f5f5f5', // A very light grey for the main background
        colorBgContainer: '#ffffff', // White for content containers like Cards
        colorText: 'rgba(0, 0, 0, 0.88)', // Standard dark text
        colorTextSecondary: 'rgba(0, 0, 0, 0.65)',
        colorBorder: '#d9d9d9',
    },
    components: {
        Wave: { disabled: true },
        Table: {
            colorHeaderBg: '#fafafa', // A slightly off-white for table headers
            colorRowHoverBg: '#f5f5f5',
        },
    },
};

// --- A professional color palette for DARK mode ---
const darkTheme: ThemeConfig = {
    // Use Ant Design's dark algorithm as a base
    algorithm: antdTheme.darkAlgorithm,
    token: {
        colorPrimary: '#1677ff', // Keep the vibrant blue for contrast
        colorBgLayout: '#141414', // A dark charcoal for the main background
        colorBgContainer: '#1d1d1d', // A slightly lighter grey for Cards
        colorText: 'rgba(255, 255, 255, 0.85)', // Light text for readability
        colorTextSecondary: 'rgba(255, 255, 255, 0.65)',
        colorBorder: '#303030',
    },
    components: {
        Wave: { disabled: true },
        Table: {
            // For the flat look you wanted
            colorHeaderBg: 'transparent',
            colorRowHoverBg: 'transparent',
        },
    },
};

export const AppThemeProvider = ({ children }: { children: ReactNode }) => {
    const [currentTheme, setTheme] = useState<Theme>('light');

    const value = {
        theme: currentTheme,
        setTheme: (newTheme: Theme) => {
            localStorage.setItem('app-theme', newTheme);
            setTheme(newTheme);
        },
    };

    return (
        <ThemeContext.Provider value={value}>
            {/* Conditionally apply the light or dark theme object */}
            <ConfigProvider theme={currentTheme === 'light' ? lightTheme : darkTheme}>
                {children}
            </ConfigProvider>
        </ThemeContext.Provider>
    );
};

export const useAppTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useAppTheme must be used within an AppThemeProvider');
    }
    return context;
};