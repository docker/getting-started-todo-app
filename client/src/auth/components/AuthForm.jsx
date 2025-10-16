import { useState } from 'react';
import { useAuth } from '../AuthContext';

export function AuthForm() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const { login, register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        console.log('Form submitted:', { isLogin, email: formData.email });

        try {
            let result;

            if (isLogin) {
                console.log('Attempting login...');
                result = await login(formData.email, formData.password);
                console.log('Login result:', result);
            } else {
                console.log('Attempting registration...');
                result = await register(
                    formData.firstName,
                    formData.lastName,
                    formData.email,
                    formData.password,
                );
                console.log('Registration result:', result);
            }

            if (!result || !result.success) {
                const errorMsg = result?.error || 'Authentication failed';
                console.error('Auth failed:', errorMsg);
                setError(errorMsg);
                setIsSubmitting(false);
            }
        } catch (err) {
            console.error('Auth error:', err);
            setError(err.message || 'An error occurred');
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError('');
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
        });
    };

    const getButtonText = () => {
        if (isSubmitting) {
            return isLogin ? 'Signing in...' : 'Creating account...';
        }
        return isLogin ? 'Sign In' : 'Create Account';
    };

    return (
        <div className="container">
            <div className="row justify-content-center min-vh-100 align-items-center">
                <div className="col-12 col-md-6 col-lg-5">
                    <div className="card shadow">
                        <div className="card-body p-4">
                            {/* Title */}
                            <h2 className="text-center mb-4">
                                {isLogin ? '🔐 Sign In' : '📝 Create Account'}
                            </h2>

                            {/* Error Alert */}
                            {error && (
                                <div
                                    className="alert alert-danger alert-dismissible fade show"
                                    role="alert"
                                >
                                    <strong>Error:</strong> {error}
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setError('')}
                                        aria-label="Close"
                                    />
                                </div>
                            )}

                            {/* Form */}
                            <form onSubmit={handleSubmit}>
                                {/* Registration Fields */}
                                {!isLogin && (
                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label
                                                htmlFor="firstName"
                                                className="form-label"
                                            >
                                                First Name
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="firstName"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                required
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label
                                                htmlFor="lastName"
                                                className="form-label"
                                            >
                                                Last Name
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="lastName"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                required
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Email */}
                                <div className="mb-3">
                                    <label
                                        htmlFor="email"
                                        className="form-label"
                                    >
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        disabled={isSubmitting}
                                        placeholder="you@example.com"
                                    />
                                </div>

                                {/* Password */}
                                <div className="mb-3">
                                    <label
                                        htmlFor="password"
                                        className="form-label"
                                    >
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        required
                                        disabled={isSubmitting}
                                        placeholder="••••••••"
                                        minLength="6"
                                    />
                                    {!isLogin && (
                                        <div className="form-text">
                                            Password must be at least 6
                                            characters
                                        </div>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="btn btn-primary w-100 mb-3"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting && (
                                        <span className="spinner-border spinner-border-sm me-2" />
                                    )}
                                    {getButtonText()}
                                </button>

                                {/* Toggle Link */}
                                <div className="text-center">
                                    <span className="text-muted">
                                        {isLogin
                                            ? "Don't have an account? "
                                            : 'Already have an account? '}
                                    </span>
                                    <button
                                        type="button"
                                        className="btn btn-link p-0"
                                        onClick={toggleMode}
                                        disabled={isSubmitting}
                                    >
                                        {isLogin ? 'Sign up' : 'Sign in'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
