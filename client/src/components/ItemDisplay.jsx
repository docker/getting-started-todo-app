import { useState } from 'react';
import PropTypes from 'prop-types';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons/faPenToSquare';
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
import faCheckSquare from '@fortawesome/fontawesome-free-regular/faCheckSquare';
import faSquare from '@fortawesome/fontawesome-free-regular/faSquare';
import './ItemDisplay.scss';

export function ItemDisplay({
    item,
    onItemUpdate,
    onItemRemoval,
    dragHandleProps,
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(item.name);

    const toggleCompletion = () => {
        fetch(`/api/items/${item.id}`, {
            method: 'PUT',
            body: JSON.stringify({
                name: item.name,
                completed: !item.completed,
            }),
            headers: { 'Content-Type': 'application/json' },
        })
            .then((r) => r.json())
            .then(onItemUpdate);
    };

    const removeItem = () => {
        fetch(`/api/items/${item.id}`, { method: 'DELETE' }).then(() =>
            onItemRemoval(item),
        );
    };

    const handleRemoveClick = () => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            removeItem();
        }
    };

    const updateName = () => {
        fetch(`/api/items/${item.id}`, {
            method: 'PUT',
            body: JSON.stringify({
                name: name,
                completed: item.completed,
            }),
            headers: { 'Content-Type': 'application/json' },
        })
            .then((r) => r.json())
            .then((updatedItem) => {
                onItemUpdate(updatedItem);
                setIsEditing(false);
            });
    };

    return (
        <Container
            fluid
            className={`item ${item.completed && 'completed'}`}
            {...dragHandleProps}
        >
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
                <Col xs={9} className="name">
                    {isEditing ? (
                        <Form.Control
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    ) : (
                        <span>{item.name}</span>
                    )}
                </Col>
                <Col xs={2} className="text-center remove">
                    {isEditing ? (
                        <Button size="sm" variant="link" onClick={updateName}>
                            Save
                        </Button>
                    ) : (
                        <>
                            <Button
                                size="sm"
                                variant="link"
                                onClick={() => setIsEditing(true)}
                                aria-label="Edit Item"
                            >
                                <FontAwesomeIcon icon={faPenToSquare} />
                            </Button>
                            <Button
                                size="sm"
                                variant="link"
                                onClick={handleRemoveClick}
                                aria-label="Remove Item"
                            >
                                <FontAwesomeIcon
                                    icon={faTrash}
                                    className="text-danger"
                                />
                            </Button>
                        </>
                    )}
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
    }),
    onItemUpdate: PropTypes.func,
    onItemRemoval: PropTypes.func,
    dragHandleProps: PropTypes.object,
};
