import { useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSpinner } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Card from 'react-bootstrap/Card';
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
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4"
        >
            <Card className="glass-card border-0 floating">
                <Card.Body className="p-4">
                    <h5 className="gradient-text mb-3 text-center">Add New Todo</h5>
                    <Form onSubmit={submitNewItem}>
                        <InputGroup>
                            <Form.Control
                                value={newItem}
                                onChange={(e) => setNewItem(e.target.value)}
                                type="text"
                                placeholder="What needs to be done?"
                                aria-label="New todo item"
                                className="glass-input border-0 fs-5"
                                style={{ minHeight: '50px' }}
                            />
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button
                                    type="submit"
                                    disabled={!newItem.length || submitting}
                                    className="glow-button"
                                    style={{ minHeight: '50px', minWidth: '120px' }}
                                >
                                    {submitting ? (
                                        <>
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                style={{ display: 'inline-block', marginRight: '8px' }}
                                            >
                                                <FontAwesomeIcon icon={faSpinner} />
                                            </motion.div>
                                            Adding...
                                        </>
                                    ) : (
                                        <>
                                            <FontAwesomeIcon icon={faPlus} className="me-2" />
                                            Add Todo
                                        </>
                                    )}
                                </Button>
                            </motion.div>
                        </InputGroup>
                    </Form>
                </Card.Body>
            </Card>
        </motion.div>
    );
}

AddItemForm.propTypes = {
    onNewItem: PropTypes.func,
};
