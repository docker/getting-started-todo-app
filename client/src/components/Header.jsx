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
            className="fixed top-0 left-0 right-0 z-50 glass-nav"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo Section */}
                    <motion.div
                        className="flex items-center space-x-3"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 400 }}
                    >
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                            <FontAwesomeIcon 
                                icon={faTasks} 
                                className="text-white text-lg"
                            />
                        </div>
                        <span className="text-2xl font-display font-bold gradient-text">
                            TodoApp
                        </span>
                    </motion.div>

                    {/* Right Section */}
                    <div className="flex items-center space-x-4">
                        {/* Theme Toggle */}
                        <motion.button
                            onClick={toggleTheme}
                            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 dark:bg-black/20 dark:hover:bg-black/30 transition-all duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FontAwesomeIcon
                                icon={isDarkMode ? faSun : faMoon}
                                className="text-gray-700 dark:text-gray-300 w-5 h-5"
                            />
                        </motion.button>

                        {/* User Dropdown */}
                        <div className="relative">
                            <motion.button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center space-x-3 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 dark:bg-black/20 dark:hover:bg-black/30 transition-all duration-300"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                    <FontAwesomeIcon 
                                        icon={faUser} 
                                        className="text-white text-sm"
                                    />
                                </div>
                                <span className="text-gray-700 dark:text-gray-300 font-medium">
                                    {user?.firstName} {user?.lastName}
                                </span>
                                <motion.div
                                    animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <FontAwesomeIcon 
                                        icon={faChevronDown} 
                                        className="text-gray-500 text-xs"
                                    />
                                </motion.div>
                            </motion.button>

                            {/* Dropdown Menu */}
                            {isDropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute right-0 mt-2 w-48 glass rounded-xl shadow-xl py-2 z-50"
                                >
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center space-x-3 px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-black/20 transition-all duration-200"
                                    >
                                        <FontAwesomeIcon icon={faSignOutAlt} className="w-4 h-4" />
                                        <span>Sign out</span>
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.nav>
    );
};
