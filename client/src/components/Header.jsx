import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faUser, 
    faSignOutAlt, 
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
    const dropdownRef = useRef(null);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
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
                                icon={faCheckCircle} 
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
                            className="header-btn header-theme-toggle"
                            whileHover={{ 
                                scale: 1.05,
                                y: -2
                            }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FontAwesomeIcon
                                icon={isDarkMode ? faSun : faMoon}
                                className="icon icon-sm"
                                style={{ color: isDarkMode ? '#fbbf24' : '#6366f1' }}
                            />
                        </motion.button>

                        {/* Enhanced User Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <motion.button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="header-btn user-dropdown-btn"
                                whileHover={{ 
                                    scale: 1.02,
                                    y: -2
                                }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <motion.div 
                                    className="user-avatar"
                                    whileHover={{ scale: 1.1 }}
                                >
                                    <FontAwesomeIcon 
                                        icon={faUser} 
                                        className="text-white text-sm"
                                    />
                                </motion.div>
                                <span className="user-display-name">
                                    {user?.firstName} {user?.lastName}
                                </span>
                                <motion.div
                                    className="dropdown-chevron"
                                    animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <FontAwesomeIcon 
                                        icon={faChevronDown} 
                                        className="icon icon-xs"
                                    />
                                </motion.div>
                            </motion.button>

                            {/* Simplified Dropdown Menu */}
                            {isDropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                    className="dropdown-menu-simplified"
                                >
                                    {/* Menu Items Only */}
                                    <div className="dropdown-items">
                                        <motion.button
                                            className="dropdown-item dropdown-item-profile"
                                            whileHover={{ x: 4, backgroundColor: 'rgba(99, 102, 241, 0.1)' }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <div className="dropdown-item-icon profile-icon">
                                                <FontAwesomeIcon icon={faUser} />
                                            </div>
                                            <div className="dropdown-item-content">
                                                <span className="dropdown-item-title">Profile Settings</span>
                                                <span className="dropdown-item-subtitle">Manage your account</span>
                                            </div>
                                        </motion.button>

                                        {/* Sign Out Button */}
                                        <motion.button
                                            onClick={handleLogout}
                                            className="dropdown-item dropdown-item-logout"
                                            whileHover={{ 
                                                x: 4, 
                                                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                                scale: 1.02
                                            }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <div className="dropdown-item-icon logout-icon">
                                                <FontAwesomeIcon icon={faSignOutAlt} />
                                            </div>
                                            <div className="dropdown-item-content">
                                                <span className="dropdown-item-title">Sign Out</span>
                                                <span className="dropdown-item-subtitle">Logout from your account</span>
                                            </div>
                                        </motion.button>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.nav>
    );
};
