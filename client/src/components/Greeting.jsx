import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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

    const letterVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
                delayChildren: 0.2
            }
        }
    };

    return (
        <motion.div
            className="text-center mb-5"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.h1 
                className="gradient-text display-4 fw-bold"
                style={{ 
                    textShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    marginBottom: '2rem'
                }}
            >
                {personalizedGreeting.split('').map((char, index) => (
                    <motion.span
                        key={`${char}-${index}`}
                        variants={letterVariants}
                        style={{ display: 'inline-block' }}
                        whileHover={{ 
                            scale: 1.1,
                            y: -5,
                            transition: { duration: 0.2 }
                        }}
                    >
                        {char === ' ' ? '\u00A0' : char}
                    </motion.span>
                ))}
            </motion.h1>
        </motion.div>
    );
}

Greeting.propTypes = {
    userName: PropTypes.string,
};
