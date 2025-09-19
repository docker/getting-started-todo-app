import { useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { apiCall } from '../utils/api';

export function AddItemForm({ onNewItem }) {
    const [newItem, setNewItem] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const submitNewItem = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const response = await apiCall('/api/items', {
                method: 'POST',
                body: JSON.stringify({ name: newItem }),
            });
            
            const item = await response.json();
            onNewItem(item);
            setSubmitting(false);
                setNewItem('');
        } catch (error) {
            console.error('Error adding item:', error);
            setSubmitting(false);
        }
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
