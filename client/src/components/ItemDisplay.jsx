import { useState } from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { faEdit, faSave, faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';
import faCheckSquare from '@fortawesome/fontawesome-free-regular/faCheckSquare';
import faSquare from '@fortawesome/fontawesome-free-regular/faSquare';
import { apiCall } from '../utils/api';
import './ItemDisplay.scss';

export function ItemDisplay({ item, onItemUpdate, onItemRemoval }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(item.name);

    const toggleCompletion = async () => {
        try {
            const response = await apiCall(`/api/items/${item.id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    name: item.name,
                    completed: !item.completed,
                }),
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const updatedItem = await response.json();
            onItemUpdate(updatedItem);
        } catch (error) {
            console.error('Error toggling completion:', error);
        }
    };

    const removeItem = async () => {
        try {
            const response = await apiCall(`/api/items/${item.id}`, { 
                method: 'DELETE' 
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            onItemRemoval(item);
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    const saveEdit = async () => {
        if (editName.trim() === '') return;
        
        try {
            const response = await apiCall(`/api/items/${item.id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    name: editName.trim(),
                    completed: item.completed,
                }),
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const updatedItem = await response.json();
            onItemUpdate(updatedItem);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating item:', error);
            // Reset to original name on error
            setEditName(item.name);
            setIsEditing(false);
        }
    };

    const cancelEdit = () => {
        setEditName(item.name);
        setIsEditing(false);
    };

    const formatRelativeTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${diffDays}d ago`;
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="mb-3"
        >
            <Card className={`glass-card border-0 ${item.completed ? 'opacity-75' : ''} floating`}>
                <Card.Body className="p-3">
                    <Container fluid>
                        <Row className="align-items-center">
                            <Col xs={1} className="text-center">
                                <motion.div
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Button
                                        variant="link"
                                        onClick={toggleCompletion}
                                        className={`p-0 ${item.completed ? 'text-success' : 'glass-text'}`}
                                        style={{ fontSize: '1.5rem' }}
                                        aria-label={
                                            item.completed
                                                ? 'Mark item as incomplete'
                                                : 'Mark item as complete'
                                        }
                                    >
                                        {item.completed ? (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ type: "spring", stiffness: 500 }}
                                            >
                                                <FontAwesomeIcon icon={faCheck} className="text-success" />
                                            </motion.div>
                                        ) : (
                                            <FontAwesomeIcon icon={faSquare} />
                                        )}
                                    </Button>
                                </motion.div>
                            </Col>
                            <Col xs={7} className="name">
                                {isEditing ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Form.Control
                                            type="text"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') saveEdit();
                                                if (e.key === 'Escape') cancelEdit();
                                            }}
                                            className="glass-input border-0"
                                            autoFocus
                                        />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        whileHover={{ x: 5 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div 
                                            className={`glass-text fs-5 ${item.completed ? 'text-decoration-line-through opacity-75' : ''}`}
                                        >
                                            {item.name}
                                        </div>
                                        <small className="glass-text-muted">
                                            Created: {formatRelativeTime(item.created_at)}
                                            {item.updated_at !== item.created_at && (
                                                <span> • Updated: {formatRelativeTime(item.updated_at)}</span>
                                            )}
                                        </small>
                                    </motion.div>
                                )}
                            </Col>
                            <Col xs={4} className="text-end">
                                {isEditing ? (
                                    <>
                                        <motion.div
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            style={{ display: 'inline-block', marginRight: '0.5rem' }}
                                        >
                                            <Button
                                                size="sm"
                                                variant="link"
                                                onClick={saveEdit}
                                                className="text-success p-2"
                                                title="Save"
                                            >
                                                <FontAwesomeIcon icon={faSave} />
                                            </Button>
                                        </motion.div>
                                        <motion.div
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            style={{ display: 'inline-block' }}
                                        >
                                            <Button
                                                size="sm"
                                                variant="link"
                                                onClick={cancelEdit}
                                                className="glass-text-muted p-2"
                                                title="Cancel"
                                            >
                                                <FontAwesomeIcon icon={faTimes} />
                                            </Button>
                                        </motion.div>
                                    </>
                                ) : (
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        style={{ display: 'inline-block', marginRight: '0.5rem' }}
                                    >
                                        <Button
                                            size="sm"
                                            variant="link"
                                            onClick={() => setIsEditing(true)}
                                            className="glass-text p-2"
                                            title="Edit"
                                        >
                                            <FontAwesomeIcon icon={faEdit} />
                                        </Button>
                                    </motion.div>
                                )}
                                <motion.div
                                    whileHover={{ scale: 1.1, color: '#dc3545' }}
                                    whileTap={{ scale: 0.9 }}
                                    style={{ display: 'inline-block' }}
                                >
                                    <Button
                                        size="sm"
                                        variant="link"
                                        onClick={removeItem}
                                        className="text-danger p-2"
                                        title="Delete"
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </Button>
                                </motion.div>
                            </Col>
                        </Row>
                    </Container>
                </Card.Body>
            </Card>
        </motion.div>
    );
}

ItemDisplay.propTypes = {
    item: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        completed: PropTypes.bool,
        created_at: PropTypes.string,
        updated_at: PropTypes.string,
    }),
    onItemUpdate: PropTypes.func,
    onItemRemoval: PropTypes.func,
};
