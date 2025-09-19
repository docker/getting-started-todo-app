import { useState, useEffect } from 'react';
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

    return (
        <Card className="mb-3 bg-primary text-white">
            <Card.Body className="text-center">
                <Card.Title className="mb-1">Current Time</Card.Title>
                <div className="h5 mb-0">{formatTime(currentTime)}</div>
            </Card.Body>
        </Card>
    );
}
