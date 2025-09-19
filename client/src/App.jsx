import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { TodoListCard } from './components/TodoListCard';
import { Greeting } from './components/Greeting';
import { LiveClock } from './components/LiveClock';
import { Header } from './components/Header';
import { AuthForm } from './components/AuthForm';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const AppContent = () => {
    const { user, isLoading, isAuthenticated } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100 
                           dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 
                           flex items-center justify-center">
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
                    <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">
                        Loading your workspace...
                    </p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100 
                       dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 
                       transition-colors duration-300">
            
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
