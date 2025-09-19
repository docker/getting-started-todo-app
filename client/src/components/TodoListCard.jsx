import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AddItemForm } from './AddNewItemForm';
import { ItemDisplay } from './ItemDisplay';
import { TodoStats } from './TodoStats';
import { apiCall } from '../utils/api';

export function TodoListCard() {
    const [items, setItems] = useState(null);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await apiCall('/api/items');
                const data = await response.json();
                setItems(data);
            } catch (err) {
                console.error('Error fetching items:', err);
                // Could show error state here if needed
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

    if (items === null) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
                <div className="text-center glass-card p-4">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        style={{ display: 'inline-block', marginBottom: '1rem' }}
                        className="fs-2"
                    >
                        ⟳
                    </motion.div>
                    <p className="glass-text mb-0">Loading your todos...</p>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <AddItemForm onNewItem={onNewItem} />
            <TodoStats items={items} />
            {items.length === 0 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-center glass-card p-5 my-4"
                >
                    <motion.div
                        animate={{ 
                            scale: [1, 1.1, 1],
                            opacity: [0.5, 1, 0.5]
                        }}
                        transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="fs-1 mb-3"
                    >
                        ✨
                    </motion.div>
                    <h4 className="gradient-text mb-3">Ready to get organized?</h4>
                    <p className="glass-text-muted">No todos yet! Add your first task above to get started.</p>
                </motion.div>
            )}
            <AnimatePresence>
                {items.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.9 }}
                        transition={{ 
                            duration: 0.3,
                            delay: index * 0.1
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
        </motion.div>
    );
}
