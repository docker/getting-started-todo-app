import { useCallback, useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { AddItemForm } from './AddNewItemForm';
import { ItemDisplay } from './ItemDisplay';
import { CATEGORIES } from '../categories';

export function TodoListCard() {
    const [items, setItems] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState('all');

    useEffect(() => {
        fetch('/api/items')
            .then((r) => r.json())
            .then(setItems);
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

    const filteredItems = items.filter(
        (item) => categoryFilter === 'all' || item.category === categoryFilter,
    );

    return (
        <>
            <AddItemForm onNewItem={onNewItem} />
            <Form.Group className="mb-3">
                <Form.Label>Filter by category</Form.Label>
                <Form.Select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    aria-label="Filter items by category"
                >
                    <option value="all">All categories</option>
                    {CATEGORIES.map((category) => (
                        <option key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                    ))}
                </Form.Select>
            </Form.Group>
            {items.length === 0 && (
                <p className="text-center">No items. Add one above!</p>
            )}

            {items.length > 0 && filteredItems.length === 0 && (
                <p className="text-center">No items match this category.</p>
            )}
            
            {filteredItems.map((item) => (
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
