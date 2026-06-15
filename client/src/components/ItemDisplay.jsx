import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import faCheckSquare from '@fortawesome/fontawesome-free-regular/faCheckSquare';
import faSquare from '@fortawesome/fontawesome-free-regular/faSquare';
import './ItemDisplay.scss';
import React from 'react';
import Badge from 'react-bootstrap/Badge';

const PRIORITY_COLORS = {
    low: { variant: 'success', label: 'Low' },
    medium: { variant: 'warning', label: 'Medium' },
    high: { variant: 'danger', label: 'High' },
};
function PriorityBadge({ priority }) {
    const config = PRIORITY_COLORS[priority] ?? PRIORITY_COLORS.medium;
    return (
        <span className={`badge bg-${config.variant}`}>{config.label}</span>
    );
}


export function ItemDisplay({ item, onItemUpdate, onItemRemoval }) {
    const toggleCompletion = () => {
        fetch(`/api/items/${item.id}`, {
            method: 'PUT',
            body: JSON.stringify({
                ...item,
                completed: !item.completed,
                category: item.category,
            }),
            headers: { 'Content-Type': 'application/json' },
        })
            .then(r => r.json())
            .then(updatedItem => onItemUpdate(updatedItem))
            .catch(err => console.error('Failed to toggle item:', err));
    };

    const removeItem = () => {
        fetch(`/api/items/${item.id}`, { method: 'DELETE' }).then(r => {
        if (!r.ok) throw new Error('Delete failed');
        onItemRemoval(item);
    })
    .catch(err => console.error('Failed to remove item:', err));
        
    };

    return (
        <Container fluid className={`item ${item.completed && 'completed'}`}>
            <Row>
                <Col xs={2} className="text-center">
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
                <Col xs={8} className="name">
                    <PriorityBadge priority={item.priority} />
                    <div>{item.name}</div>
                    <Badge bg="secondary" className="category-badge text-uppercase">
                        {item.category}
                    </Badge>
                </Col>
                <Col xs={2} className="text-center remove">
                    <Button
                        size="sm"
                        variant="link"
                        onClick={removeItem}
                        aria-label="Remove Item"
                    >
                        <FontAwesomeIcon
                            icon={faTrash}
                            className="text-danger"
                        />
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
        category: PropTypes.string,
        priority: PropTypes.string
    }),
    onItemUpdate: PropTypes.func,
    onItemRemoval: PropTypes.func,
};
