import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

export function LiveClock() {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
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

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    return (
        <motion.div
            className="mb-8 max-w-md mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="glass rounded-2xl p-6 shadow-xl border border-white/20">
                {/* Date Section */}
                <div className="flex items-center justify-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                        <FontAwesomeIcon 
                            icon={faCalendarAlt} 
                            className="text-white text-lg"
                        />
                    </div>
                    <div className="text-left">
                        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium uppercase tracking-wide">
                            Today
                        </p>
                        <h3 className="text-gray-800 dark:text-gray-200 text-lg font-semibold">
                            {formatDate(currentTime)}
                        </h3>
                    </div>
                </div>

                {/* Time Section */}
                <div className="flex items-center justify-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                        <FontAwesomeIcon 
                            icon={faClock} 
                            className="text-white text-lg"
                        />
                    </div>
                    <motion.div 
                        variants={tickVariants}
                        initial="initial"
                        animate="animate"
                        className="text-left"
                    >
                        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium uppercase tracking-wide">
                            Current Time
                        </p>
                        <div className="font-mono text-2xl font-bold text-gray-800 dark:text-gray-200 tabular-nums">
                            {formatTime(currentTime)}
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
