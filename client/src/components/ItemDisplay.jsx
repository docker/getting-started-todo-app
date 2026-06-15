import { useState, useEffect } from 'react';
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

export function ItemDisplay({ item, onItemUpdate, onItemRemoval }) {
    const [isAnimating, setIsAnimating] = useState(false);
    const [wasCompleted, setWasCompleted] = useState(item.completed);
    const [celebrationImage, setCelebrationImage] = useState(null);

    useEffect(() => {
        // Trigger animation when item becomes completed
        if (item.completed && !wasCompleted) {
            setIsAnimating(true);
            
            // Fetch an image based on the item's name
            fetch(`/api/image?q=${encodeURIComponent(item.name)}`)
                .then((r) => r.json())
                .then((data) => {
                    setCelebrationImage(data.imageUrl);
                })
                .catch((err) => {
                    console.error('Failed to fetch image:', err);
                });
            
            setTimeout(() => {
                setIsAnimating(false);
                // Clear image after animation
                setTimeout(() => setCelebrationImage(null), 500);
            }, 2000);
        }
        setWasCompleted(item.completed);
    }, [item.completed, wasCompleted, item.name]);

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

    return (
        <div className="item-wrapper">
            {isAnimating && celebrationImage && (
                <div className="celebration-image-container">
                    <img
                        src={celebrationImage}
                        alt={`Celebration for ${item.name}`}
                        className="celebration-image"
                    />
                </div>
            )}
            <Container
                fluid
                className={`item ${item.completed && 'completed'} ${
                    isAnimating && 'celebrate'
                }`}
            >
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
                                className={isAnimating ? 'icon-bounce' : ''}
                            />
                        </Button>
                    </Col>
                    <Col xs={8} className="name">
                        {item.name}
                        {isAnimating && (
                            <span className="sparkles">
                                <span className="sparkle">✨</span>
                                <span className="sparkle">🎉</span>
                                <span className="sparkle">⭐</span>
                            </span>
                        )}
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
        </div>
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
};
