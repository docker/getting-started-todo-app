import PropTypes from 'prop-types';
import { useState } from 'react';
import { apiCall } from '../../../services/api';

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

            if (response && response.ok) {
                onItemUpdate({ ...item, completed: !item.completed });
            }
        } catch (error) {
            console.error('Error toggling completion:', error);
        }
    };

    const saveEdit = async () => {
        if (!editName.trim()) return;

        try {
            const response = await apiCall(`/api/items/${item.id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    name: editName,
                    completed: item.completed,
                }),
            });

            if (response && response.ok) {
                onItemUpdate({ ...item, name: editName });
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };

    const cancelEdit = () => {
        setEditName(item.name);
        setIsEditing(false);
    };

    const removeItem = async () => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;

        try {
            const response = await apiCall(`/api/items/${item.id}`, {
                method: 'DELETE',
            });

            if (response && response.ok) {
                onItemRemoval(item.id);
            }
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    return (
        <div className={`list-group-item ${item.completed ? 'list-group-item-success' : ''}`}>
            <div className="d-flex align-items-center">
                <input
                    type="checkbox"
                    className="form-check-input me-3"
                    checked={item.completed}
                    onChange={toggleCompletion}
                />

                <div className="flex-grow-1">
                    {isEditing ? (
                        <input
                            type="text"
                            className="form-control"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') saveEdit();
                                if (e.key === 'Escape') cancelEdit();
                            }}
                            autoFocus
                        />
                    ) : (
                        <span className={item.completed ? 'text-decoration-line-through' : ''}>
                            {item.name}
                        </span>
                    )}
                </div>

                <div className="btn-group ms-3">
                    {isEditing ? (
                        <>
                            <button onClick={saveEdit} className="btn btn-sm btn-success" title="Save">
                                ✓
                            </button>
                            <button onClick={cancelEdit} className="btn btn-sm btn-secondary" title="Cancel">
                                ✕
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => setIsEditing(true)} className="btn btn-sm btn-primary" title="Edit">
                                ✏️
                            </button>
                            <button onClick={removeItem} className="btn btn-sm btn-danger" title="Delete">
                                🗑️
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

ItemDisplay.propTypes = {
    item: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        completed: PropTypes.bool,
    }).isRequired,
    onItemUpdate: PropTypes.func.isRequired,
    onItemRemoval: PropTypes.func.isRequired,
};
