import { useState } from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faSave, faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';
import { apiCall } from '../utils/api';

export function ItemDisplay({ item, onItemUpdate, onItemRemoval }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(item.name);

    const toggleCompletion = async () => {
        try {
            const response = await apiCall(`/api/items/${item.id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    name: item.name,
                    completed: !item.completed,
                }),
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const updatedItem = await response.json();
            onItemUpdate(updatedItem);
        } catch (error) {
            console.error('Error toggling completion:', error);
        }
    };

    const removeItem = async () => {
        try {
            const response = await apiCall(`/api/items/${item.id}`, { 
                method: 'DELETE' 
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            onItemRemoval(item);
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    const saveEdit = async () => {
        if (editName.trim() === '') return;
        
        try {
            const response = await apiCall(`/api/items/${item.id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    name: editName.trim(),
                    completed: item.completed,
                }),
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const updatedItem = await response.json();
            onItemUpdate(updatedItem);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating item:', error);
            setEditName(item.name);
            setIsEditing(false);
        }
    };

    const cancelEdit = () => {
        setEditName(item.name);
        setIsEditing(false);
    };

    const formatRelativeTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${diffDays}d ago`;
    };

    const itemVariants = {
        initial: { opacity: 0, scale: 0.95 },
        animate: { 
            opacity: 1, 
            scale: 1,
            transition: { duration: 0.3 }
        },
        exit: { 
            opacity: 0, 
            scale: 0.95,
            transition: { duration: 0.2 }
        }
    };

    return (
        <motion.div
            variants={itemVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            layout
            className="group"
        >
            <div className={`glass rounded-2xl p-4 shadow-lg border border-white/20 transition-all duration-300
                           ${item.completed ? 'opacity-75' : ''} 
                           ${isEditing ? 'ring-2 ring-blue-500 ring-opacity-50' : 'hover:shadow-xl'}`}>
                
                <div className="flex items-center space-x-4">
                    {/* Checkbox */}
                    <motion.button
                        onClick={toggleCompletion}
                        className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300
                                   ${item.completed 
                                     ? 'bg-green-500 border-green-500 text-white' 
                                     : 'border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400'
                                   }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        {item.completed && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 500 }}
                            >
                                <FontAwesomeIcon icon={faCheck} className="w-3 h-3" />
                            </motion.div>
                        )}
                    </motion.button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        {isEditing ? (
                            <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') saveEdit();
                                    if (e.key === 'Escape') cancelEdit();
                                }}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                                         bg-white/80 dark:bg-black/80 text-gray-800 dark:text-gray-200
                                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                autoFocus
                            />
                        ) : (
                            <div>
                                <h3 className={`text-lg font-medium transition-all duration-300 ${
                                    item.completed 
                                    ? 'line-through text-gray-500 dark:text-gray-400' 
                                    : 'text-gray-800 dark:text-gray-200'
                                }`}>
                                    {item.name}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Created {formatRelativeTime(item.created_at)}
                                    {item.updated_at !== item.created_at && (
                                        <span> • Updated {formatRelativeTime(item.updated_at)}</span>
                                    )}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className={`flex items-center space-x-2 transition-opacity duration-300 ${
                        isEditing ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}>
                        {isEditing ? (
                            <>
                                <motion.button
                                    onClick={saveEdit}
                                    className="p-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    title="Save"
                                >
                                    <FontAwesomeIcon icon={faSave} className="w-4 h-4" />
                                </motion.button>
                                <motion.button
                                    onClick={cancelEdit}
                                    className="p-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition-colors"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    title="Cancel"
                                >
                                    <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
                                </motion.button>
                            </>
                        ) : (
                            <>
                                <motion.button
                                    onClick={() => setIsEditing(true)}
                                    className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    title="Edit"
                                >
                                    <FontAwesomeIcon icon={faEdit} className="w-4 h-4" />
                                </motion.button>
                                <motion.button
                                    onClick={removeItem}
                                    className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    title="Delete"
                                >
                                    <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                                </motion.button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

ItemDisplay.propTypes = {
    item: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        completed: PropTypes.bool,
        created_at: PropTypes.string,
        updated_at: PropTypes.string,
    }),
    onItemUpdate: PropTypes.func,
    onItemRemoval: PropTypes.func,
};

ItemDisplay.propTypes = {
    item: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        completed: PropTypes.bool,
        created_at: PropTypes.string,
        updated_at: PropTypes.string,
    }),
    onItemUpdate: PropTypes.func,
    onItemRemoval: PropTypes.func,
};
