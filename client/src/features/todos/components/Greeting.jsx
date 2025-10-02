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

    const getTimeBasedGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 17) return 'Good afternoon';
        return 'Good evening';
    };

    const timeGreeting = getTimeBasedGreeting();

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: 'easeOut',
            },
        },
    };

    const waveVariants = {
        animate: {
            rotate: [0, 14, -8, 14, -4, 10, 0],
            transition: {
                duration: 2,
                ease: 'easeInOut',
                times: [0, 0.2, 0.4, 0.6, 0.7, 0.8, 1],
                repeat: Infinity,
                repeatDelay: 3,
            },
        },
    };

    return (
        <motion.div
            className="text-center mb-8 mt-20"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="max-w-2xl mx-auto px-4">
                <motion.div
                    className="inline-flex items-center space-x-3 mb-4"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-gray-800 dark:text-gray-100">
                        {timeGreeting},{' '}
                        <span className="gradient-text">
                            {userName || 'Friend'}
                        </span>
                        !
                    </h1>
                    <motion.span
                        className="text-3xl sm:text-4xl"
                        variants={waveVariants}
                        animate="animate"
                        style={{ transformOrigin: '70% 70%' }}
                    >
                        👋
                    </motion.span>
                </motion.div>

                <motion.p
                    className="text-lg text-gray-600 dark:text-gray-300 font-medium"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    Ready to tackle your day? Let's get organized! ✨
                </motion.p>
            </div>
        </motion.div>
    );
}

Greeting.propTypes = {
    userName: PropTypes.string,
};

Greeting.propTypes = {
    userName: PropTypes.string,
};
