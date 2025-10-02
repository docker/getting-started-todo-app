import { faCheck, faClock, faList, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { AnimatePresence, motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { apiCall } from '../../../services/api';
import { AddItemForm } from './AddNewItemForm';
import { EmptyState } from './EmptyState';
import { ItemDisplay } from './ItemDisplay';

const FILTER_OPTIONS = {
    ALL: 'all',
    ACTIVE: 'active',
    COMPLETED: 'completed'
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
                return items.filter(item => !item.completed);
            case FILTER_OPTIONS.COMPLETED:
                return items.filter(item => item.completed);
            default:
                return items;
        }
    };

    const filteredItems = getFilteredItems();

    const filterVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.3 }
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.5,
                staggerChildren: 0.1
            }
        }
    };

    /** Filter button component for All/Active/Completed filters */
    const FilterButton = ({ filterType, label, icon, count }) => (
        <motion.button
            onClick={() => setFilter(filterType)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300
                       ${filter === filterType
                         ? 'bg-blue-500 text-white shadow-lg'
                         : 'bg-white/50 dark:bg-black/50 text-gray-600 dark:text-gray-400 hover:bg-white/70 dark:hover:bg-black/70'
                       }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <FontAwesomeIcon icon={icon} className="w-4 h-4" />
            <span>{label}</span>
            <span className={`text-xs px-2 py-1 rounded-full ${
                filter === filterType
                ? 'bg-white/20'
                : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
            }`}>
                {count}
            </span>
        </motion.button>
    );

    FilterButton.propTypes = {
        filterType: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        icon: PropTypes.object.isRequired,
        count: PropTypes.number.isRequired,
    };

    if (items === null) {
        return (
            <div className="flex justify-center items-center py-20">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="text-blue-500"
                >
                    <FontAwesomeIcon icon={faSpinner} size="2x" />
                </motion.div>
            </div>
        );
    }

    return (
        <motion.div
            className="max-w-4xl mx-auto space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <AddItemForm onNewItem={onNewItem} />

            {/* Filter Buttons */}
            {items.length > 0 && (
                <motion.div
                    className="flex justify-center space-x-2 mb-6"
                    variants={filterVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <FilterButton
                        filterType={FILTER_OPTIONS.ALL}
                        label="All"
                        icon={faList}
                        count={items.length}
                    />
                    <FilterButton
                        filterType={FILTER_OPTIONS.ACTIVE}
                        label="Active"
                        icon={faClock}
                        count={items.filter(item => !item.completed).length}
                    />
                    <FilterButton
                        filterType={FILTER_OPTIONS.COMPLETED}
                        label="Completed"
                        icon={faCheck}
                        count={items.filter(item => item.completed).length}
                    />
                </motion.div>
            )}

            {/* Display filtered items or empty state */}
            {filteredItems.length === 0 ? (
                items.length === 0 ? (
                    <EmptyState />
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-12"
                    >
                        <div className="text-4xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                            No {filter} tasks found
                        </h3>
                        <p className="text-gray-500 dark:text-gray-500">
                            Try switching to a different filter
                        </p>
                    </motion.div>
                )
            ) : (
                <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                        {filteredItems.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                transition={{
                                    duration: 0.3,
                                    delay: index * 0.05
                                }}
                                layout
                            >
                                <ItemDisplay
                                    item={item}
                                    onItemUpdate={onItemUpdate}
                                    onItemRemoval={onItemRemoval}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </motion.div>
    );
}
