import { useState } from 'react';
import PropTypes from 'prop-types';
import { InputGroup, Form, Button } from 'react-bootstrap';
import { CATEGORIES, DEFAULT_CATEGORY } from '../categories';
import './AddNewItemForm.scss'
export function AddItemForm({ onNewItem }) {
    const [newItem, setNewItem] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [priority, setPriority] = useState('medium');
    const [category, setCategory] = useState(DEFAULT_CATEGORY);
    const [dueDate, setDueDate] = useState('');
    const PRIORITY_SYMBOLS = { low: '🟢', medium: '🟡', high: '⚠️' };
    const CATEGORY_SYMBOLS = { work: '💼', personal: '👤', shopping: '🛍️' };

    const submitNewItem = (e) => {
        e.preventDefault();
        setSubmitting(true);

        const options = {
            method: 'POST',
            body: JSON.stringify({ name: newItem, priority, category, due_date: dueDate || null }),
            headers: { 'Content-Type': 'application/json' },
        };

        fetch('/api/items', options)
            .then(r => r.json())
            .then(item => {
                onNewItem(item);
                setSubmitting(false);
                setNewItem('');
                setPriority('medium');
                setCategory(DEFAULT_CATEGORY);
                setDueDate('');
            })
            .catch(() => setSubmitting(false));
    };

    return (
        <InputGroup className="mb-3 w-100">

            <Form.Control
                placeholder="New Item"
                aria-describedby="basic-addon2"
                value={newItem}
                onChange={e => setNewItem(e.target.value)}
                style={{ flex: '1 1 auto', minWidth: '120px' }}
            />

            <Form.Select
                value={priority}
                onChange={e => setPriority(e.target.value)}
                aria-label="Priority"
                className="d-md-none"
                style={{ maxWidth: '56px', paddingLeft: '6px', paddingRight: '4px' }}
            >
                {Object.entries(PRIORITY_SYMBOLS).map(([val, sym]) => (
                    <option key={val} value={val}>{sym}</option>
                ))}
            </Form.Select>

            <Form.Select
                value={priority}
                onChange={e => setPriority(e.target.value)}
                aria-label="Priority"
                className="d-none d-md-block"
                style={{ maxWidth: '120px' }}
            >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </Form.Select>

            <Form.Select
                value={category}
                onChange={e => setCategory(e.target.value)}
                aria-label="Category"
                className="d-md-none"
                style={{ maxWidth: '56px', paddingLeft: '6px', paddingRight: '4px' }}
            >
                {CATEGORIES.map(c => (
                    <option key={c} value={c}>{CATEGORY_SYMBOLS[c]}</option>
                ))}
            </Form.Select>

            <Form.Select
                value={category}
                onChange={e => setCategory(e.target.value)}
                aria-label="Category"
                className="d-none d-md-block"
                style={{ maxWidth: '130px' }}
            >
                {CATEGORIES.map(c => (
                    <option key={c} value={c}>
                        {c.charAt(0).toUpperCase() + c.slice(1)}
                    </option>
                ))}
            </Form.Select>

            <Button
                variant="outline-secondary"
                className="d-md-none date-picker-btn"
                aria-label="Due Date"
                title={dueDate || 'Select due date'}
            >
                <span aria-hidden="true">📅</span>
                <Form.Control
                    type="date"
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    aria-label="Due Date"
                    className="date-picker-input"
                />
            </Button>

            <Form.Control
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                aria-label="Due Date"
                className="d-none d-md-block"
            />

            <Button
                variant="success"
                disabled={!newItem.length}
                onClick={submitNewItem}
            >
                {submitting ? 'Adding...' : 'Add Item'}
            </Button>
        </InputGroup>
    );
}

AddItemForm.propTypes = {
    onNewItem: PropTypes.func,
};
