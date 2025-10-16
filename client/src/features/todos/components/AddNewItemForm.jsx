import PropTypes from 'prop-types';
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

    return (
        <div className="card mb-4">
            <div className="card-body">
                <h5 className="card-title text-center mb-3">Add New Task</h5>
                <form onSubmit={submitNewItem}>
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            value={newItem}
                            onChange={(e) => setNewItem(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="What do you need to do?"
                            disabled={submitting}
                        />
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={submitting || !newItem.trim()}
                        >
                            {submitting ? 'Adding...' : 'Add Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

AddItemForm.propTypes = {
    onNewItem: PropTypes.func.isRequired,
};
