import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { AuthForm } from './auth/components/AuthForm';
import { Header } from './components/Header';
import { LiveClock } from './components/LiveClock';
import { Greeting } from './features/todos/components/Greeting';
import { TodoListCard } from './features/todos/components/TodoListCard';

const AppContent = () => {
    const { user, isLoading, isAuthenticated } = useAuth();
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    const getBackgroundStyle = () => ({
        background: isDarkMode
            ? 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)'
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        backgroundAttachment: 'fixed',
        paddingTop: isAuthenticated ? '80px' : '0',
    });

    if (isLoading) {
        return (
            <div
                className="min-h-screen d-flex align-items-center justify-content-center"
                style={getBackgroundStyle()}
            >
                <div className="text-center">
                    <div
                        className="spinner-border text-primary mb-3"
                        role="status"
                    >
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-white">Loading your workspace...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={getBackgroundStyle()}>
            {isAuthenticated && <Header />}

            <main className="relative">
                {!isAuthenticated ? (
                    <div className="container py-5 d-flex align-items-center justify-content-center min-vh-100">
                        <AuthForm />
                    </div>
                ) : (
                    <div className="container py-4">
                        <Greeting userName={user?.firstName} />
                        <LiveClock />
                        <TodoListCard />
                    </div>
                )}
            </main>
        </div>
    );
};

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;
