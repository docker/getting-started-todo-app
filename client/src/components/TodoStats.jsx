import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export function TodoStats({ items }) {
    if (!items || items.length === 0) {
        return null;
    }

    const total = items.length;
    const completed = items.filter(item => item.completed).length;
    const pending = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    const getRecentActivity = () => {
        const now = new Date();
        const recentItems = items.filter(item => {
            const createdDate = new Date(item.created_at);
            const diffHours = (now - createdDate) / (1000 * 60 * 60);
            return diffHours <= 24;
        });
        return recentItems.length;
    };

    return (
        <Card className="mb-3">
            <Card.Body>
                <Card.Title className="text-center mb-3">Todo Statistics</Card.Title>
                <Row className="text-center">
                    <Col xs={3}>
                        <div className="h4 text-primary">{total}</div>
                        <small className="text-muted">Total</small>
                    </Col>
                    <Col xs={3}>
                        <div className="h4 text-success">{completed}</div>
                        <small className="text-muted">Completed</small>
                    </Col>
                    <Col xs={3}>
                        <div className="h4 text-warning">{pending}</div>
                        <small className="text-muted">Pending</small>
                    </Col>
                    <Col xs={3}>
                        <div className="h4 text-info">{getRecentActivity()}</div>
                        <small className="text-muted">Added Today</small>
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col className="text-center">
                        <div className="h5">{completionRate}%</div>
                        <small className="text-muted">Completion Rate</small>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
}

TodoStats.propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        completed: PropTypes.bool,
        created_at: PropTypes.string,
        updated_at: PropTypes.string,
    })),
};
