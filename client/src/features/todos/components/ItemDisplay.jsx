import { faCheck, faEdit, faSave, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { apiCall } from '../../../services/api';

/**
 * ItemDisplay component - Displays a single todo item with edit, delete, and completion toggle
 * @param {Object} props - Component props
 * @param {Object} props.item - The todo item object
 * @param {Function} props.onItemUpdate - Callback when item is updated
 * @param {Function} props.onItemRemoval - Callback when item is removed
 */
export function ItemDisplay({ item, onItemUpdate, onItemRemoval }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(item.name);

    /**
     * Toggles the completion status of the todo item
     */
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

    /**
     * Removes the todo item
     */
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

    /**
     * Saves the edited todo item name
     */
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

    /**
     * Cancels the editing mode and reverts changes
     */
    const cancelEdit = () => {
        setEditName(item.name);
        setIsEditing(false);
    };

    /**
     * Formats a date string into a relative time string (e.g., "2h ago").
     * @param {string} dateString - The ISO date string to format.
     * @returns {string} The formatted relative time.
     */
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
            className="item-card-wrapper"
        >
            <div className={`card-task ${item.completed ? 'completed' : ''} ${isEditing ? 'editing' : ''}`}>

                <div className="flex items-center gap-md">
                    {/* Enhanced Checkbox */}
                    <motion.button
                        onClick={toggleCompletion}
                        className={`checkbox-modern ${item.completed ? 'checkbox-checked' : 'checkbox-unchecked'}`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        {item.completed && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 500 }}
                            >
                                <FontAwesomeIcon icon={faCheck} className="icon icon-sm" />
                            </motion.div>
                        )}
                    </motion.button>

                    {/* Content Section */}
                    <div className="flex-1 min-w-0">
                        {isEditing ? (
                            <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') saveEdit();
                                    if (e.key === 'Escape') cancelEdit();
                                }}
                                className="form-input w-full"
                                placeholder="Edit task name..."
                            />
                        ) : (
                            <div>
                                <h3 className={`task-title ${item.completed ? 'task-completed' : ''}`}>
                                    {item.name}
                                </h3>
                                <div className="task-meta-enhanced">
                                    <span>📅 Created {formatRelativeTime(item.created_at)}</span>
                                    {item.updated_at !== item.created_at && (
                                        <span>✏️ Updated {formatRelativeTime(item.updated_at)}</span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Always Visible Action Buttons */}
                    <div className="action-buttons flex items-center gap-xs">
                        {isEditing ? (
                            <>
                                <motion.button
                                    onClick={saveEdit}
                                    className="btn-modern btn-success btn-sm"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    title="Save changes"
                                >
                                    <FontAwesomeIcon icon={faSave} className="icon icon-sm" />
                                </motion.button>
                                <motion.button
                                    onClick={cancelEdit}
                                    className="btn-modern btn-secondary btn-sm"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    title="Cancel editing"
                                >
                                    <FontAwesomeIcon icon={faTimes} className="icon icon-sm" />
                                </motion.button>
                            </>
                        ) : (
                            <>
                                <motion.button
                                    onClick={() => setIsEditing(true)}
                                    className="btn-modern btn-secondary btn-sm"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    title="Edit task"
                                >
                                    <FontAwesomeIcon icon={faEdit} className="icon icon-sm" />
                                </motion.button>
                                <motion.button
                                    onClick={removeItem}
                                    className="btn-modern btn-danger btn-sm"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    title="Delete task"
                                >
                                    <FontAwesomeIcon icon={faTrash} className="icon icon-sm" />
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
