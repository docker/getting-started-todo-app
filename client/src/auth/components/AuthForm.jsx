import { faEye, faEyeSlash, faSpinner, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAuth } from '../AuthContext';

export function AuthForm() {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const { login, register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            if (isLogin) {
                await login(formData.email, formData.password);
            } else {
                await register(formData.firstName, formData.lastName, formData.email, formData.password);
            }
        } catch (err) {
            setError(err.message || 'An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const formVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" }
        }
    };

    const switchVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.3 }
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <motion.div
                className="glass rounded-3xl p-8 shadow-2xl border border-white/20"
                variants={formVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg"
                    >
                        <FontAwesomeIcon icon={faUser} className="text-white text-2xl" />
                    </motion.div>

                    <h1 className="text-3xl font-display font-bold gradient-text mb-2">
                        {isLogin ? 'Welcome Back' : 'Join TodoApp'}
                    </h1>

                    <p className="text-gray-600 dark:text-gray-300">
                        {isLogin ? 'Sign in to continue your productivity journey' : 'Create your account to get started'}
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-xl p-4 mb-6"
                    >
                        <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
                    </motion.div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Fields (Register only) */}
                    {!isLogin && (
                        <motion.div
                            variants={switchVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid grid-cols-2 gap-4"
                        >
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    required={!isLogin}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600
                                             bg-white/70 dark:bg-black/70 text-gray-800 dark:text-gray-200
                                             placeholder-gray-500 dark:placeholder-gray-400
                                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                             transition-all duration-300"
                                    placeholder="John"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    required={!isLogin}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600
                                             bg-white/70 dark:bg-black/70 text-gray-800 dark:text-gray-200
                                             placeholder-gray-500 dark:placeholder-gray-400
                                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                             transition-all duration-300"
                                    placeholder="Doe"
                                />
                            </div>
                        </motion.div>
                    )}

                    {/* Email Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600
                                     bg-white/70 dark:bg-black/70 text-gray-800 dark:text-gray-200
                                     placeholder-gray-500 dark:placeholder-gray-400
                                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                     transition-all duration-300"
                            placeholder="john@example.com"
                        />
                    </div>

                    {/* Password Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 dark:border-gray-600
                                         bg-white/70 dark:bg-black/70 text-gray-800 dark:text-gray-200
                                         placeholder-gray-500 dark:placeholder-gray-400
                                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                         transition-all duration-300"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                            >
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-3 px-6 rounded-xl font-semibold text-white shadow-lg
                                   transition-all duration-300 flex items-center justify-center space-x-2
                                   ${isSubmitting
                                     ? 'bg-gray-400 cursor-not-allowed'
                                     : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:shadow-xl transform hover:scale-[1.02]'
                                   }`}
                        whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                        whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                    >
                        {isSubmitting ? (
                            <>
                                <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                                <span>{isLogin ? 'Signing in...' : 'Creating account...'}</span>
                            </>
                        ) : (
                            <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                        )}
                    </motion.button>
                </form>

                {/* Toggle Form */}
                <div className="mt-8 text-center">
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                    </p>
                    <motion.button
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError('');
                            setFormData({ firstName: '', lastName: '', email: '', password: '' });
                        }}
                        className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-semibold transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {isLogin ? 'Create an account' : 'Sign in instead'}
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
}
