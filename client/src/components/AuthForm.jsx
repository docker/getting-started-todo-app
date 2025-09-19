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
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                style={{ width: '100%', maxWidth: '400px' }}
            >
                <Card className="shadow-lg border-0">
                    <Card.Body className="p-4">
                        <motion.div variants={itemVariants} className="text-center mb-4">
                            <h2 className="fw-bold text-primary">
                                {isLogin ? 'Welcome Back!' : 'Create Account'}
                            </h2>
                            <p className="text-muted">
                                {isLogin
                                    ? 'Sign in to continue to your tasks'
                                    : 'Join us to organize your life'}
                            </p>
                        </motion.div>

                        <AnimatePresence>
                            {alert && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Alert variant={alert.type} className="mb-3">
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
                                            <Form.Label>First Name</Form.Label>
                                            <InputGroup>
                                                <InputGroup.Text>
                                                    <FontAwesomeIcon icon={faUser} />
                                                </InputGroup.Text>
                                                <Form.Control
                                                    type="text"
                                                    name="firstName"
                                                    value={formData.firstName}
                                                    onChange={handleInputChange}
                                                    isInvalid={!!errors.firstName}
                                                    placeholder="Enter your first name"
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
                                            <Form.Label>Last Name</Form.Label>
                                            <InputGroup>
                                                <InputGroup.Text>
                                                    <FontAwesomeIcon icon={faUser} />
                                                </InputGroup.Text>
                                                <Form.Control
                                                    type="text"
                                                    name="lastName"
                                                    value={formData.lastName}
                                                    onChange={handleInputChange}
                                                    isInvalid={!!errors.lastName}
                                                    placeholder="Enter your last name"
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
                                <Form.Label>Email</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text>
                                        <FontAwesomeIcon icon={faEnvelope} />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        isInvalid={!!errors.email}
                                        placeholder="Enter your email"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.email}
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </motion.div>

                            <motion.div variants={itemVariants} className="mb-3">
                                <Form.Label>Password</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text>
                                        <FontAwesomeIcon icon={faLock} />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        isInvalid={!!errors.password}
                                        placeholder="Enter your password"
                                    />
                                    <Button
                                        variant="outline-secondary"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{ border: 'none' }}
                                    >
                                        <FontAwesomeIcon
                                            icon={showPassword ? faEyeSlash : faEye}
                                        />
                                    </Button>
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
                                        className="mb-3"
                                    >
                                        <Form.Label>Confirm Password</Form.Label>
                                        <InputGroup>
                                            <InputGroup.Text>
                                                <FontAwesomeIcon icon={faLock} />
                                            </InputGroup.Text>
                                            <Form.Control
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleInputChange}
                                                isInvalid={!!errors.confirmPassword}
                                                placeholder="Confirm your password"
                                            />
                                            <Button
                                                variant="outline-secondary"
                                                onClick={() =>
                                                    setShowConfirmPassword(!showConfirmPassword)
                                                }
                                                style={{ border: 'none' }}
                                            >
                                                <FontAwesomeIcon
                                                    icon={showConfirmPassword ? faEyeSlash : faEye}
                                                />
                                            </Button>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.confirmPassword}
                                            </Form.Control.Feedback>
                                        </InputGroup>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <motion.div variants={itemVariants} className="mb-3">
                                <motion.div
                                    variants={buttonVariants}
                                    whileHover="hover"
                                    whileTap="tap"
                                >
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        size="lg"
                                        className="w-100"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <span
                                                    className="spinner-border spinner-border-sm me-2"
                                                    role="status"
                                                    aria-hidden="true"
                                                ></span>
                                                {isLogin ? 'Signing In...' : 'Creating Account...'}
                                            </>
                                        ) : (
                                            <>{isLogin ? 'Sign In' : 'Create Account'}</>
                                        )}
                                    </Button>
                                </motion.div>
                            </motion.div>

                            <motion.div variants={itemVariants} className="text-center">
                                <p className="mb-0">
                                    {isLogin ? "Don't have an account? " : 'Already have an account? '}
                                    <motion.span
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        style={{ display: 'inline-block' }}
                                    >
                                        <Button
                                            variant="link"
                                            onClick={toggleMode}
                                            className="p-0 text-decoration-none"
                                            disabled={isLoading}
                                        >
                                            {isLogin ? 'Sign Up' : 'Sign In'}
                                        </Button>
                                    </motion.span>
                                </p>
                            </motion.div>
                        </Form>
                    </Card.Body>
                </Card>
            </motion.div>
        </div>
    );
};
