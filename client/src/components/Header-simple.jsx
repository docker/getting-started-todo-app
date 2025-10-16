import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';

export const Header = () => {
    const { user, logout } = useAuth();
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = !isDarkMode;
        setIsDarkMode(newTheme);

        if (newTheme) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm fixed-top">
            <div className="container">
                <span className="navbar-brand">
                    ✅ TodoApp
                </span>

                <div className="d-flex align-items-center">
                    <button
                        className="btn btn-outline-secondary btn-sm me-2"
                        onClick={toggleTheme}
                        title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
                    >
                        {isDarkMode ? '☀️' : '🌙'}
                    </button>

                    <div className="dropdown">
                        <button
                            className="btn btn-outline-primary btn-sm dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            👤 {user?.firstName || 'User'}
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end">
                            <li>
                                <span className="dropdown-item-text">
                                    {user?.email}
                                </span>
                            </li>
                            <li><hr className="dropdown-divider" /></li>
                            <li>
                                <button className="dropdown-item" onClick={logout}>
                                    🚪 Sign Out
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
};
