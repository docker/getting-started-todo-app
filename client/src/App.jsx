import { motion, AnimatePresence } from 'framer-motion';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { Spinner } from 'react-bootstrap';
import { TodoListCard } from './components/TodoListCard';
import { Greeting } from './components/Greeting';
import { LiveClock } from './components/LiveClock';
import { Header } from './components/Header';
import { AuthForm } from './components/AuthForm';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AnimatedBackground } from './components/AnimatedBackground';

const AppContent = () => {
    const { user, isLoading, isAuthenticated } = useAuth();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.5,
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 },
        },
    };

    if (isLoading) {
        return (
            <AnimatedBackground>
                <div className="d-flex justify-content-center align-items-center min-vh-100">
                    <div className="text-center glass-card p-4">
                        <Spinner animation="border" variant="light" className="mb-3" />
                        <p className="glass-text">Loading...</p>
                    </div>
                </div>
            </AnimatedBackground>
        );
    }

    return (
        <AnimatedBackground>
            <AnimatePresence mode="wait">
                {!isAuthenticated ? (
                    <motion.div
                        key="auth"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <AuthForm />
                    </motion.div>
                ) : (
                    <motion.div
                        key="app"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                    >
                        <Header />
                        <Container>
                            <Row>
                                <Col md={{ offset: 2, span: 8 }}>
                                    <motion.div variants={itemVariants}>
                                        <LiveClock />
                                    </motion.div>
                                    <motion.div variants={itemVariants}>
                                        <Greeting userName={user?.firstName} />
                                    </motion.div>
                                    <motion.div variants={itemVariants}>
                                        <TodoListCard />
                                    </motion.div>
                                </Col>
                            </Row>
                        </Container>
                    </motion.div>
                )}
            </AnimatePresence>
        </AnimatedBackground>
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
