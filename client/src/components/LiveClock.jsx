import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from 'react-bootstrap/Card';

export function LiveClock() {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (date) => {
        return date.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    const tickVariants = {
        initial: { scale: 1 },
        animate: { 
            scale: [1, 1.02, 1],
            transition: { 
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card className="glass-card border-0 mb-3 floating">
                <Card.Body className="text-center p-4">
                    <Card.Title className="gradient-text mb-3 fs-4">Current Time</Card.Title>
                    <motion.div 
                        variants={tickVariants}
                        initial="initial"
                        animate="animate"
                        className="glass-text fs-5 fw-semibold"
                    >
                        {formatTime(currentTime)}
                    </motion.div>
                </Card.Body>
            </Card>
        </motion.div>
    );
}
