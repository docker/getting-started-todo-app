import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ProgressBar from 'react-bootstrap/ProgressBar';

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

    const statVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.5 }
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const progressVariants = {
        hidden: { width: 0 },
        visible: {
            width: `${completionRate}%`,
            transition: { duration: 1, ease: "easeOut" }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4"
        >
            <Card className="glass-card border-0 floating">
                <Card.Body className="p-4">
                    <Card.Title className="gradient-text text-center mb-4 fs-4">
                        📊 Your Progress
                    </Card.Title>
                    
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <Row className="text-center mb-4">
                            <Col xs={3}>
                                <motion.div 
                                    variants={statVariants}
                                    whileHover={{ scale: 1.1, y: -5 }}
                                    className="glass-card p-3 h-100"
                                    style={{ background: 'rgba(102, 126, 234, 0.2)' }}
                                >
                                    <div className="h3 glass-text mb-1">{total}</div>
                                    <small className="glass-text-muted">Total</small>
                                </motion.div>
                            </Col>
                            <Col xs={3}>
                                <motion.div 
                                    variants={statVariants}
                                    whileHover={{ scale: 1.1, y: -5 }}
                                    className="glass-card p-3 h-100"
                                    style={{ background: 'rgba(40, 167, 69, 0.2)' }}
                                >
                                    <div className="h3 glass-text mb-1">{completed}</div>
                                    <small className="glass-text-muted">Completed</small>
                                </motion.div>
                            </Col>
                            <Col xs={3}>
                                <motion.div 
                                    variants={statVariants}
                                    whileHover={{ scale: 1.1, y: -5 }}
                                    className="glass-card p-3 h-100"
                                    style={{ background: 'rgba(255, 193, 7, 0.2)' }}
                                >
                                    <div className="h3 glass-text mb-1">{pending}</div>
                                    <small className="glass-text-muted">Pending</small>
                                </motion.div>
                            </Col>
                            <Col xs={3}>
                                <motion.div 
                                    variants={statVariants}
                                    whileHover={{ scale: 1.1, y: -5 }}
                                    className="glass-card p-3 h-100"
                                    style={{ background: 'rgba(23, 162, 184, 0.2)' }}
                                >
                                    <div className="h3 glass-text mb-1">{getRecentActivity()}</div>
                                    <small className="glass-text-muted">Added Today</small>
                                </motion.div>
                            </Col>
                        </Row>
                        
                        <motion.div
                            variants={statVariants}
                            className="text-center"
                        >
                            <h5 className="glass-text mb-3">Completion Rate: {completionRate}%</h5>
                            <div className="position-relative">
                                <ProgressBar 
                                    className="glass-progress"
                                    style={{ 
                                        height: '20px',
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        borderRadius: '10px'
                                    }}
                                >
                                    <motion.div
                                        className="progress-bar"
                                        variants={progressVariants}
                                        initial="hidden"
                                        animate="visible"
                                        style={{
                                            background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
                                            borderRadius: '10px'
                                        }}
                                    />
                                </ProgressBar>
                                {completionRate === 100 && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 1, type: "spring" }}
                                        className="position-absolute top-50 start-50 translate-middle"
                                    >
                                        🎉
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                </Card.Body>
            </Card>
        </motion.div>
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
