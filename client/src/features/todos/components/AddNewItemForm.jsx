import { faPlus, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { PropTypes } from 'prop-types';
import { useState } from 'react';
import { apiCall } from '../../../services/api';

/**
 * Renders a form to add new items with animated UI.
 * @param {Object} props - The component props.
 * @param {function} props.onNewItem - Callback to handle the newly added item.
 * @returns {JSX.Element} - The AddItemForm component.
 */
export function AddItemForm({ onNewItem }) {
    const [newItem, setNewItem] = useState('');
    const [submitting, setSubmitting] = useState(false);

    /**
     * Submits a new item to the API and handles state updates.
     * @param {Object} e - The form submission event.
     * @returns {Promise<void>} - A promise that resolves when the submission is complete.
     */
    const submitNewItem = async (e) => {
        e.preventDefault();
        if (!newItem.trim()) return;

        setSubmitting(true);

        try {
            const response = await apiCall('/api/items', {
                method: 'POST',
                body: JSON.stringify({ name: newItem.trim() }),
            });

            const item = await response.json();
            onNewItem(item);
            setNewItem('');
        } catch (error) {
            console.error('Error adding item:', error);
        } finally {
            setSubmitting(false);
        }
    };

    /** Handles Enter key press to submit the form */
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submitNewItem(e);
        }
    };

    const formVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    const buttonVariants = {
        idle: { scale: 1 },
        hover: {
            scale: 1.05,
            transition: { type: "spring", stiffness: 400 }
        },
        tap: { scale: 0.95 }
    };

    return (
        <motion.div
            className="mb-8 max-w-2xl mx-auto"
            variants={formVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="glass rounded-2xl p-6 shadow-xl border border-white/20">
                <div className="text-center mb-6">
                    <h2 className="text-xl font-display font-semibold text-gray-800 dark:text-gray-200 mb-2">
                        Add New Task
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                        What would you like to accomplish today?
                    </p>
                </div>

                <form onSubmit={submitNewItem} className="space-y-4">
                    <div className="relative">
                        <input
                            type="text"
                            value={newItem}
                            onChange={(e) => setNewItem(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="e.g. Buy groceries, Call mom, Finish project..."
                            disabled={submitting}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600
                                     bg-white/50 dark:bg-black/50 text-gray-800 dark:text-gray-200
                                     placeholder-gray-500 dark:placeholder-gray-400
                                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                     transition-all duration-300"
                        />
                        {newItem && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                            >
                                <span className="text-gray-400 text-sm">
                                    Press Enter ↵
                                </span>
                            </motion.div>
                        )}
                    </div>

                    <motion.button
                        type="submit"
                        disabled={submitting || !newItem.trim()}
                        variants={buttonVariants}
                        initial="idle"
                        whileHover="hover"
                        whileTap="tap"
                        className={`w-full py-3 px-6 rounded-xl font-medium text-white shadow-lg
                                   transition-all duration-300 flex items-center justify-center space-x-2
                                   ${submitting || !newItem.trim()
                                     ? 'bg-gray-400 cursor-not-allowed'
                                     : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:shadow-xl'
                                   }`}
                    >
                        {submitting ? (
                            <>
                                <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                                <span>Adding task...</span>
                            </>
                        ) : (
                            <>
                                <FontAwesomeIcon icon={faPlus} />
                                <span>Add Task</span>
                            </>
                        )}
                    </motion.button>
                </form>
            </div>
        </motion.div>
    );
}

AddItemForm.propTypes = {
    onNewItem: PropTypes.func.isRequired,
};
