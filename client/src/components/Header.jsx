import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faUser, 
    faSignOutAlt, 
    faTasks, 
    faChevronDown,
    faMoon,
    faSun 
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';

const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 },
    },
};

export const Header = () => {
    const { user, logout } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    const handleLogout = () => {
        logout();
        setIsDropdownOpen(false);
    };

    const toggleTheme = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        
        if (newMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    return (
        <motion.nav
            variants={headerVariants}
            initial="hidden"
            animate="visible"
            className="glass-nav"
            style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(25px)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Enhanced Logo Section */}
                    <motion.div
                        className="flex items-center space-x-3"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 400 }}
                    >
                        <motion.div 
                            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                            style={{
                                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
                            }}
                            whileHover={{ 
                                scale: 1.1,
                                boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)'
                            }}
                        >
                            <FontAwesomeIcon 
                                icon={faTasks} 
                                className="text-white text-lg"
                            />
                        </motion.div>
                        <motion.span 
                            className="text-2xl font-display font-bold"
                            style={{
                                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                            }}
                            whileHover={{ scale: 1.05 }}
                        >
                            TodoApp Pro
                        </motion.span>
                    </motion.div>

                    {/* Enhanced Right Section */}
                    <div className="flex items-center space-x-4">
                        {/* Enhanced Theme Toggle */}
                        <motion.button
                            onClick={toggleTheme}
                            className="p-2 rounded-xl transition-all duration-300"
                            style={{
                                background: 'rgba(255, 255, 255, 0.15)',
                                border: '1px solid rgba(255, 255, 255, 0.25)',
                                backdropFilter: 'blur(10px)'
                            }}
                            whileHover={{ 
                                scale: 1.05,
                                background: 'rgba(255, 255, 255, 0.25)',
                                y: -2
                            }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FontAwesomeIcon
                                icon={isDarkMode ? faSun : faMoon}
                                className="w-5 h-5"
                                style={{ color: isDarkMode ? '#fbbf24' : '#6366f1' }}
                            />
                        </motion.button>

                        {/* Enhanced User Dropdown */}
                        <div className="relative">
                            <motion.button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center space-x-3 px-4 py-2 rounded-xl transition-all duration-300"
                                style={{
                                    background: 'rgba(255, 255, 255, 0.15)',
                                    border: '1px solid rgba(255, 255, 255, 0.25)',
                                    backdropFilter: 'blur(10px)'
                                }}
                                whileHover={{ 
                                    scale: 1.02,
                                    background: 'rgba(255, 255, 255, 0.25)',
                                    y: -2
                                }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <motion.div 
                                    className="w-8 h-8 rounded-full flex items-center justify-center"
                                    style={{
                                        background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                                        boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)'
                                    }}
                                    whileHover={{ scale: 1.1 }}
                                >
                                    <FontAwesomeIcon 
                                        icon={faUser} 
                                        className="text-white text-sm"
                                    />
                                </motion.div>
                                <span 
                                    className="font-medium"
                                    style={{ color: isDarkMode ? '#f9fafb' : '#1f2937' }}
                                >
                                    {user?.firstName} {user?.lastName}
                                </span>
                                <motion.div
                                    animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <FontAwesomeIcon 
                                        icon={faChevronDown} 
                                        className="text-xs"
                                        style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }}
                                    />
                                </motion.div>
                            </motion.button>

                            {/* Enhanced Dropdown Menu */}
                            {isDropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute right-0 mt-2 w-48 rounded-xl shadow-xl py-2 z-50"
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.15)',
                                        backdropFilter: 'blur(20px)',
                                        border: '1px solid rgba(255, 255, 255, 0.25)',
                                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)'
                                    }}
                                >
                                    <motion.button
                                        onClick={handleLogout}
                                        className="w-full flex items-center space-x-3 px-4 py-2 text-left transition-all duration-200"
                                        style={{ 
                                            color: isDarkMode ? '#f9fafb' : '#1f2937'
                                        }}
                                        whileHover={{ 
                                            background: 'rgba(255, 255, 255, 0.1)',
                                            x: 4
                                        }}
                                    >
                                        <FontAwesomeIcon 
                                            icon={faSignOutAlt} 
                                            className="w-4 h-4" 
                                            style={{ color: '#ef4444' }}
                                        />
                                        <span>Sign out</span>
                                    </motion.button>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.nav>
    );
};
