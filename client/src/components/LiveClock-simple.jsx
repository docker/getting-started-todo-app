import { useEffect, useState } from 'react';

export function LiveClock() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className="card mb-3">
            <div className="card-body text-center">
                <h3 className="display-6">🕐 {formatTime(time)}</h3>
                <p className="text-muted">📅 {formatDate(time)}</p>
            </div>
        </div>
    );
}
