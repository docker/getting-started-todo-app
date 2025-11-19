import { useCallback, useEffect, useState } from 'react';
import { AddItemForm } from './AddNewItemForm';
import { ItemDisplay } from './ItemDisplay';

export function TodoListCard() {
    const [items, setItems] = useState(null);

    const sortItems = (items) => {
        // Sort items: incomplete first, completed last, and newly added at the top
        return items.sort((a, b) => {
            if (a.completed === b.completed) {
                return b.id.localeCompare(a.id); // Compare by ID to show newly added items first
            }
            return a.completed - b.completed; // Incomplete items first
        });
    };

    useEffect(() => {
        fetch('/api/items')
            .then((r) => r.json())
            .then((data) => setItems(sortItems(data))); // Apply sorting after fetching items
    }, []);

    const onNewItem = useCallback(
        (newItem) => {
            setItems((prevItems) => sortItems([...prevItems, newItem]));
        },
        [],
    );

    const onItemUpdate = useCallback(
        (updatedItem) => {
            setItems((prevItems) => {
                const updatedItems = prevItems.map((item) =>
                    item.id === updatedItem.id ? updatedItem : item
                );
                return sortItems(updatedItems);
            });
        },
        [],
    );

    const onItemRemoval = useCallback(
        (item) => {
            setItems((prevItems) => {
                const updatedItems = prevItems.filter((i) => i.id !== item.id);
                return sortItems(updatedItems);
            });
        },
        [],
    );

    if (items === null) return 'Loading...';

    return (
        <>
            <AddItemForm onNewItem={onNewItem} />
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
