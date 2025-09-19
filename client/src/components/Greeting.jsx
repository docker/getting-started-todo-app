import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export function Greeting({ userName }) {
    const [greeting, setGreeting] = useState(null);

    useEffect(() => {
        fetch('/api/greeting')
            .then((res) => res.json())
            .then((data) => setGreeting(data.greeting));
    }, [setGreeting]);

    if (!greeting) return null;

    const personalizedGreeting = userName 
        ? `${greeting}, ${userName}!` 
        : greeting;

    return <h1 className="text-center mb-5">{personalizedGreeting}</h1>;
}

Greeting.propTypes = {
    userName: PropTypes.string,
};
