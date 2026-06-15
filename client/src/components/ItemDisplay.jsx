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

//shows due date
function DueDateDisplay({ dueDate, completed }) {
    if (!dueDate) return null;
    const today = new Date().toISOString().slice(0, 10);
    const isOverdue = !completed && dueDate < today;
    return (
        <span className="due-date ms-2">
            <small className="text-muted">Due: {dueDate}</small>
            {isOverdue && (
                <span className='badge bg-danger ms-1'>Overdue</span>
            )}
        </span>
    );

}
export function ItemDisplay({ item, onItemUpdate, onItemRemoval }) {
    const toggleCompletion = () => {
        fetch(`/api/items/${item.id}`, {
            method: 'PUT',
            body: JSON.stringify({
                ...item,
                completed: !item.completed,
            }),
            headers: { 'Content-Type': 'application/json' },
        })
            .then(r => r.json())
            .then(updatedItem => onItemUpdate(updatedItem))
            .catch(err => console.error('Failed to toggle item:', err));
    };

    const removeItem = () => {
        fetch(`/api/items/${item.id}`, { method: 'DELETE' })
            .then(r => {
                if (!r.ok) throw new Error('Delete failed');
                onItemRemoval(item);
            })
            .catch(err => console.error('Failed to remove item:', err));
    };

    const today = new Date().toISOString().slice(0, 10);
    const isOverdue = item.due_date && !item.completed && item.due_date < today;
    return (
        <Container fluid className={`item ${item.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`}>
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
                <Col xs={8} className="name d-flex align-items-center gap-2 flex-wrap">
                    <PriorityBadge priority={item.priority} />
                    <Badge bg="secondary" className="text-uppercase" style={{ fontSize: '0.65rem' }}>
                        {item.category}
                    </Badge>
                    {item.name}
                    <DueDateDisplay dueDate={item.due_date} completed={item.completed} />
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
        priority: PropTypes.string,
        due_date: PropTypes.string,
    }),
    onItemUpdate: PropTypes.func,
    onItemRemoval: PropTypes.func,
};
