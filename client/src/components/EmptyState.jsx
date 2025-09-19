import { motion } from 'framer-motion';

export function EmptyState() {
    const containerVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    const iconVariants = {
        animate: {
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0],
            transition: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <motion.div
            className="text-center py-16 px-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div
                className="text-6xl mb-6"
                variants={iconVariants}
                animate="animate"
            >
                ✨
            </motion.div>
            
            <h3 className="text-2xl font-display font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Ready to get organized?
            </h3>
            
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-6 max-w-md mx-auto">
                Add your first task above and start building productive habits!
            </p>
            
            <div className="flex justify-center space-x-4 text-4xl">
                <motion.span
                    animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, -10, 0] 
                    }}
                    transition={{ 
                        duration: 2, 
                        repeat: Infinity, 
                        delay: 0 
                    }}
                >
                    📝
                </motion.span>
                <motion.span
                    animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, -10, 10, 0] 
                    }}
                    transition={{ 
                        duration: 2, 
                        repeat: Infinity, 
                        delay: 0.5 
                    }}
                >
                    🎯
                </motion.span>
                <motion.span
                    animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, -10, 0] 
                    }}
                    transition={{ 
                        duration: 2, 
                        repeat: Infinity, 
                        delay: 1 
                    }}
                >
                    🚀
                </motion.span>
            </div>
        </motion.div>
    );
}
