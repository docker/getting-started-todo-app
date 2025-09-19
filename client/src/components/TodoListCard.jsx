import { useCallback, useEffect, useState } from 'react';
import { AddItemForm } from './AddNewItemForm';
import { ItemDisplay } from './ItemDisplay';
import { TodoStats } from './TodoStats';
import { apiCall } from '../utils/api';

export function TodoListCard() {
    const [items, setItems] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await apiCall('/api/items');
                const data = await response.json();
                setItems(data);
            } catch (err) {
                console.error('Error fetching items:', err);
                setError('Failed to load items');
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

    if (items === null) return 'Loading...';

    return (
        <>
            <AddItemForm onNewItem={onNewItem} />
            <TodoStats items={items} />
            {items.length === 0 && (
                <p className="text-center">No items yet! Add one above!</p>
            )}
            {items.map((item) => (
                <ItemDisplay
                    key={item.id}
                    item={item}
                    onItemUpdate={onItemUpdate}
                    onItemRemoval={onItemRemoval}
                />
            ))}
        </>
    );
}
