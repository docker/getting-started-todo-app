// Utility function for authenticated API calls
export const apiCall = async (url, options = {}) => {
    const token = localStorage.getItem('token');
    
    const config = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    };
    
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(url, config);
    
    if (!response.ok) {
        if (response.status === 401) {
            // Token expired or invalid, redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.reload();
            return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response;
};
