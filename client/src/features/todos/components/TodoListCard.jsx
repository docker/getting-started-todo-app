import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { apiCall } from '../../../services/api';
import { AddItemForm } from './AddNewItemForm';
import { EmptyState } from './EmptyState';
import { ItemDisplay } from './ItemDisplay';

const FILTER_OPTIONS = {
    ALL: 'all',
    ACTIVE: 'active',
    COMPLETED: 'completed',
};

/**
 * TodoListCard component - Main container for the todo list application
 * Handles filtering, CRUD operations, and displays todo items
 */
export function TodoListCard() {
    const [items, setItems] = useState(null);
    const [filter, setFilter] = useState(FILTER_OPTIONS.ALL);

    useEffect(() => {
        /** Fetches all todo items from the API */
        const fetchItems = async () => {
            try {
                const response = await apiCall('/api/items');
                const data = await response.json();
                setItems(data);
            } catch (err) {
                console.error('Error fetching items:', err);
            }
        };

        fetchItems();
    }, []);

    const onNewItem = useCallback(
        (newItem) => {
            setItems([...items, newItem]);
        },
        [items],
    );

    const onItemUpdate = useCallback(
        (item) => {
            const index = items.findIndex((i) => i.id === item.id);
            setItems([
                ...items.slice(0, index),
                item,
                ...items.slice(index + 1),
            ]);
        },
        [items],
    );

    const onItemRemoval = useCallback(
        (item) => {
            const index = items.findIndex((i) => i.id === item.id);
            setItems([...items.slice(0, index), ...items.slice(index + 1)]);
        },
        [items],
    );

    /** Filters items based on the current filter state */
    const getFilteredItems = () => {
        if (!items) return [];

        switch (filter) {
            case FILTER_OPTIONS.ACTIVE:
                return items.filter((item) => !item.completed);
            case FILTER_OPTIONS.COMPLETED:
                return items.filter((item) => item.completed);
            default:
                return items;
        }
    };

    const filteredItems = getFilteredItems();

    /** Filter button component for All/Active/Completed filters */
    const FilterButton = ({ filterType, label, count }) => (
        <button
            onClick={() => setFilter(filterType)}
            className={`btn ${
                filter === filterType ? 'btn-primary' : 'btn-outline-secondary'
            }`}
        >
            {label} <span className="badge bg-secondary">{count}</span>
        </button>
    );

    FilterButton.propTypes = {
        filterType: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        count: PropTypes.number.isRequired,
    };

    if (items === null) {
        return (
            <div className="d-flex justify-content-center align-items-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <AddItemForm onNewItem={onNewItem} />

            {/* Filter Buttons */}
            {items.length > 0 && (
                <div
                    className="btn-group mb-4 d-flex justify-content-center"
                    role="group"
                >
                    <FilterButton
                        filterType={FILTER_OPTIONS.ALL}
                        label="All"
                        count={items.length}
                    />
                    <FilterButton
                        filterType={FILTER_OPTIONS.ACTIVE}
                        label="Active"
                        count={items.filter((item) => !item.completed).length}
                    />
                    <FilterButton
                        filterType={FILTER_OPTIONS.COMPLETED}
                        label="Completed"
                        count={items.filter((item) => item.completed).length}
                    />
                </div>
            )}

            {/* Display filtered items or empty state */}
            {filteredItems.length === 0 ? (
                items.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div className="text-center py-5">
                        <div className="display-1 mb-3">🔍</div>
                        <h3 className="h5">No {filter} tasks found</h3>
                        <p className="text-muted">
                            Try switching to a different filter
                        </p>
                    </div>
                )
            ) : (
                <div className="list-group">
                    {filteredItems.map((item) => (
                        <div key={item.id} className="mb-2">
                            <ItemDisplay
                                item={item}
                                onItemUpdate={onItemUpdate}
                                onItemRemoval={onItemRemoval}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
