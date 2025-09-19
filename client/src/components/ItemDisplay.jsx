import { useState } from 'react';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { faEdit, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import faCheckSquare from '@fortawesome/fontawesome-free-regular/faCheckSquare';
import faSquare from '@fortawesome/fontawesome-free-regular/faSquare';
import './ItemDisplay.scss';

export function ItemDisplay({ item, onItemUpdate, onItemRemoval }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(item.name);

    const toggleCompletion = () => {
        fetch(`/api/items/${item.id}`, {
            method: 'PUT',
            body: JSON.stringify({
                name: item.name,
                completed: !item.completed,
            }),
            headers: { 'Content-Type': 'application/json' },
        })
            .then((r) => {
                if (!r.ok) {
                    throw new Error(`HTTP error! status: ${r.status}`);
                }
                return r.json();
            })
            .then(onItemUpdate)
            .catch((error) => {
                console.error('Error toggling completion:', error);
            });
    };

    const removeItem = () => {
        fetch(`/api/items/${item.id}`, { method: 'DELETE' })
            .then((r) => {
                if (!r.ok) {
                    throw new Error(`HTTP error! status: ${r.status}`);
                }
                onItemRemoval(item);
            })
            .catch((error) => {
                console.error('Error removing item:', error);
            });
    };

    const saveEdit = () => {
        if (editName.trim() === '') return;
        
        fetch(`/api/items/${item.id}`, {
            method: 'PUT',
            body: JSON.stringify({
                name: editName.trim(),
                completed: item.completed,
            }),
            headers: { 'Content-Type': 'application/json' },
        })
            .then((r) => {
                if (!r.ok) {
                    throw new Error(`HTTP error! status: ${r.status}`);
                }
                return r.json();
            })
            .then((updatedItem) => {
                onItemUpdate(updatedItem);
                setIsEditing(false);
            })
            .catch((error) => {
                console.error('Error updating item:', error);
                // Reset to original name on error
                setEditName(item.name);
                setIsEditing(false);
            });
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
        <Container fluid className={`item ${item.completed && 'completed'}`}>
            <Row>
                <Col xs={1} className="text-center">
                    <Button
                        className="toggles"
                        size="sm"
                        variant="link"
                        onClick={toggleCompletion}
                        aria-label={
                            item.completed
                                ? 'Mark item as incomplete'
                                : 'Mark item as complete'
                        }
                    >
                        <FontAwesomeIcon
                            icon={item.completed ? faCheckSquare : faSquare}
                        />
                    </Button>
                </Col>
                <Col xs={6} className="name">
                    {isEditing ? (
                        <Form.Control
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') saveEdit();
                                if (e.key === 'Escape') cancelEdit();
                            }}
                            autoFocus
                        />
                    ) : (
                        <div>
                            <div>{item.name}</div>
                            <small className="text-muted">
                                Created: {formatRelativeTime(item.created_at)}
                                {item.updated_at !== item.created_at && (
                                    <span> • Updated: {formatRelativeTime(item.updated_at)}</span>
                                )}
                            </small>
                        </div>
                    )}
                </Col>
                <Col xs={5} className="text-end">
                    {isEditing ? (
                        <>
                            <Button
                                size="sm"
                                variant="link"
                                onClick={saveEdit}
                                className="text-success me-2"
                                title="Save"
                            >
                                <FontAwesomeIcon icon={faSave} />
                            </Button>
                            <Button
                                size="sm"
                                variant="link"
                                onClick={cancelEdit}
                                className="text-secondary me-2"
                                title="Cancel"
                            >
                                <FontAwesomeIcon icon={faTimes} />
                            </Button>
                        </>
                    ) : (
                        <Button
                            size="sm"
                            variant="link"
                            onClick={() => setIsEditing(true)}
                            className="text-primary me-2"
                            title="Edit"
                        >
                            <FontAwesomeIcon icon={faEdit} />
                        </Button>
                    )}
                    <Button
                        size="sm"
                        variant="link"
                        onClick={removeItem}
                        className="text-danger"
                        title="Delete"
                    >
                        <FontAwesomeIcon icon={faTrash} />
                    </Button>
                </Col>
            </Row>
        </Container>
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
