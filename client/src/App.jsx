import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AnimatePresence, motion } from 'framer-motion';
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
        paddingTop: isAuthenticated ? '80px' : '0'
    });

    if (isLoading) {
        return (
            <div
                className="min-h-screen flex items-center justify-center"
                style={getBackgroundStyle()}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="text-blue-500 mb-4"
                    >
                        <FontAwesomeIcon icon={faSpinner} size="3x" />
                    </motion.div>
                    <p className="text-white text-lg font-medium">
                        Loading your workspace...
                    </p>
                </motion.div>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen"
            style={getBackgroundStyle()}
        >
            {isAuthenticated && <Header />}

            <main className="relative">
                <AnimatePresence mode="wait">
                    {!isAuthenticated ? (
                        <motion.div
                            key="auth"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                            className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen"
                        >
                            <AuthForm />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="app"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="container mx-auto px-4 py-8 space-y-8"
                        >
                            <Greeting userName={user?.firstName} />
                            <LiveClock />
                            <TodoListCard />
                        </motion.div>
                    )}
                </AnimatePresence>
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
