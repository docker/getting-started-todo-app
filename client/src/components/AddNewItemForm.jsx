import { useState } from 'react';
import PropTypes from 'prop-types';
import { InputGroup, Form, Button } from 'react-bootstrap';
import { CATEGORIES, DEFAULT_CATEGORY } from '../categories';

export function AddItemForm({ onNewItem }) {
    const [newItem, setNewItem] = useState('');
    const [category, setCategory] = useState(DEFAULT_CATEGORY);
    const [submitting, setSubmitting] = useState(false);
    const [priority, setPriority] = useState('medium');

    const submitNewItem = (e) => {
        e.preventDefault();
        setSubmitting(true);

        const options = {
            method: 'POST',
            body: JSON.stringify({ name: newItem, category, priority }),
            headers: { 'Content-Type': 'application/json' },
        };

        fetch('/api/items', options)
            .then(r => r.json())
            .then(item => {
                onNewItem(item);
                setSubmitting(false);
                setNewItem('');
                setCategory(DEFAULT_CATEGORY);
                setPriority('');
            })
            .catch(() => setSubmitting(false))
    };

    return (
        <Form onSubmit={submitNewItem}>
            <InputGroup className="mb-3">
                <Form.Control
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    type="text"
                    placeholder="New Item"
                    aria-label="New item"
                />
                <Form.Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    aria-label="Select category"
                >
                    {CATEGORIES.map((categoryOption) => (
                        <option key={categoryOption} value={categoryOption}>
                            {categoryOption.charAt(0).toUpperCase() + categoryOption.slice(1)}
                        </option>
                    ))}
                </Form.Select>
                <Button
                    type="submit"
                    variant="success"
                    disabled={!newItem.length}
                    className={submitting ? 'disabled' : ''}
                >
                    {submitting ? 'Adding...' : 'Add Item'}
                </Button>
            </InputGroup>
        </Form>
    );
}

AddItemForm.propTypes = {
    onNewItem: PropTypes.func,
};
