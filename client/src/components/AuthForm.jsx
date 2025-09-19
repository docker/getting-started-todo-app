import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Form, Button, Card, Alert, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';

const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            staggerChildren: 0.1,
        },
    },
    exit: {
        opacity: 0,
        y: -50,
        transition: { duration: 0.3 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.4 },
    },
};

const buttonVariants = {
    hover: {
        scale: 1.05,
        transition: { duration: 0.2 },
    },
    tap: {
        scale: 0.95,
        transition: { duration: 0.1 },
    },
};

export const AuthForm = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState(null);

    const { login, register } = useAuth();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!isLogin) {
            if (!formData.firstName.trim()) {
                newErrors.firstName = 'First name is required';
            }
            if (!formData.lastName.trim()) {
                newErrors.lastName = 'Last name is required';
            }
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!isLogin && formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setIsLoading(true);
        setAlert(null);

        try {
            const result = isLogin
                ? await login(formData.email, formData.password)
                : await register(
                      formData.firstName,
                      formData.lastName,
                      formData.email,
                      formData.password
                  );

            if (!result.success) {
                setAlert({ type: 'danger', message: result.error });
            }
        } catch (error) {
            setAlert({ type: 'danger', message: 'An unexpected error occurred' });
        } finally {
            setIsLoading(false);
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
        });
        setErrors({});
        setAlert(null);
    };

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100 p-3">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-100"
                style={{ maxWidth: '450px' }}
            >
                <Card className="glass-card border-0 shadow-lg floating">
                    <Card.Body className="p-4">
                        <motion.div variants={itemVariants} className="text-center mb-4">
                            <h2 className="gradient-text mb-2">
                                {isLogin ? 'Welcome Back!' : 'Join Us Today!'}
                            </h2>
                            <p className="glass-text-muted">
                                {isLogin 
                                    ? 'Sign in to access your todos' 
                                    : 'Create your account to get started'
                                }
                            </p>
                        </motion.div>

                        <AnimatePresence>
                            {alert && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mb-3"
                                >
                                    <Alert 
                                        variant={alert.type} 
                                        className="glass-card border-0 text-center"
                                        style={{ 
                                            background: alert.type === 'danger' 
                                                ? 'rgba(220, 53, 69, 0.2)' 
                                                : 'rgba(40, 167, 69, 0.2)',
                                            color: 'white'
                                        }}
                                    >
                                        {alert.message}
                                    </Alert>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <Form onSubmit={handleSubmit}>
                            <AnimatePresence>
                                {!isLogin && (
                                    <>
                                        <motion.div
                                            variants={itemVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="hidden"
                                            className="mb-3"
                                        >
                                            <Form.Label className="glass-text">First Name</Form.Label>
                                            <InputGroup>
                                                <InputGroup.Text className="glass-input border-0">
                                                    <FontAwesomeIcon icon={faUser} className="text-white" />
                                                </InputGroup.Text>
                                                <Form.Control
                                                    type="text"
                                                    name="firstName"
                                                    value={formData.firstName}
                                                    onChange={handleInputChange}
                                                    isInvalid={!!errors.firstName}
                                                    placeholder="Enter your first name"
                                                    className="glass-input border-0"
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.firstName}
                                                </Form.Control.Feedback>
                                            </InputGroup>
                                        </motion.div>

                                        <motion.div
                                            variants={itemVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="hidden"
                                            className="mb-3"
                                        >
                                            <Form.Label className="glass-text">Last Name</Form.Label>
                                            <InputGroup>
                                                <InputGroup.Text className="glass-input border-0">
                                                    <FontAwesomeIcon icon={faUser} className="text-white" />
                                                </InputGroup.Text>
                                                <Form.Control
                                                    type="text"
                                                    name="lastName"
                                                    value={formData.lastName}
                                                    onChange={handleInputChange}
                                                    isInvalid={!!errors.lastName}
                                                    placeholder="Enter your last name"
                                                    className="glass-input border-0"
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.lastName}
                                                </Form.Control.Feedback>
                                            </InputGroup>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>

                            <motion.div variants={itemVariants} className="mb-3">
                                <Form.Label className="glass-text">Email</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text className="glass-input border-0">
                                        <FontAwesomeIcon icon={faEnvelope} className="text-white" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        isInvalid={!!errors.email}
                                        placeholder="Enter your email"
                                        className="glass-input border-0"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.email}
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </motion.div>

                            <motion.div variants={itemVariants} className="mb-3">
                                <Form.Label className="glass-text">Password</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text className="glass-input border-0">
                                        <FontAwesomeIcon icon={faLock} className="text-white" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        isInvalid={!!errors.password}
                                        placeholder="Enter your password"
                                        className="glass-input border-0"
                                    />
                                    <InputGroup.Text
                                        className="glass-input border-0"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <FontAwesomeIcon 
                                            icon={showPassword ? faEyeSlash : faEye} 
                                            className="text-white"
                                        />
                                    </InputGroup.Text>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.password}
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </motion.div>

                            <AnimatePresence>
                                {!isLogin && (
                                    <motion.div
                                        variants={itemVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="hidden"
                                        className="mb-4"
                                    >
                                        <Form.Label className="glass-text">Confirm Password</Form.Label>
                                        <InputGroup>
                                            <InputGroup.Text className="glass-input border-0">
                                                <FontAwesomeIcon icon={faLock} className="text-white" />
                                            </InputGroup.Text>
                                            <Form.Control
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleInputChange}
                                                isInvalid={!!errors.confirmPassword}
                                                placeholder="Confirm your password"
                                                className="glass-input border-0"
                                            />
                                            <InputGroup.Text
                                                className="glass-input border-0"
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            >
                                                <FontAwesomeIcon 
                                                    icon={showConfirmPassword ? faEyeSlash : faEye} 
                                                    className="text-white"
                                                />
                                            </InputGroup.Text>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.confirmPassword}
                                            </Form.Control.Feedback>
                                        </InputGroup>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <motion.div variants={itemVariants} className="d-grid gap-2 mb-3">
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="glow-button pulse"
                                    style={{ minHeight: '50px' }}
                                >
                                    {isLoading ? (
                                        <>
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                style={{ display: 'inline-block', marginRight: '8px' }}
                                            >
                                                ⟳
                                            </motion.div>
                                            {isLogin ? 'Signing In...' : 'Creating Account...'}
                                        </>
                                    ) : (
                                        isLogin ? 'Sign In' : 'Create Account'
                                    )}
                                </Button>
                            </motion.div>

                            <motion.div variants={itemVariants} className="text-center">
                                <p className="glass-text-muted mb-2">
                                    {isLogin ? "Don't have an account?" : 'Already have an account?'}
                                </p>
                                <Button
                                    variant="link"
                                    onClick={toggleMode}
                                    className="glass-text p-0 text-decoration-none"
                                    style={{ border: 'none', background: 'none' }}
                                >
                                    <motion.span
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="gradient-text"
                                    >
                                        {isLogin ? 'Sign up here' : 'Sign in here'}
                                    </motion.span>
                                </Button>
                            </motion.div>
                        </Form>
                    </Card.Body>
                </Card>
            </motion.div>
        </div>
    );
};
