import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

export function TodoStatsEnhanced({ items }) {
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

    // Circular progress bar SVG component
    const CircularProgress = ({ percentage, size = 120, strokeWidth = 8, label, value }) => {
        const radius = (size - strokeWidth) / 2;
        const circumference = 2 * Math.PI * radius;
        const strokeDashoffset = circumference - (percentage / 100) * circumference;

        return (
            <div className="progress-circle" style={{ width: size, height: size }}>
                <svg className="progress-circle-svg" width={size} height={size}>
                    <defs>
                        <linearGradient id={`progressGradient-${label}`} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="var(--gradient-start)" />
                            <stop offset="100%" stopColor="var(--gradient-end)" />
                        </linearGradient>
                    </defs>
                    <circle
                        className="progress-circle-bg"
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        strokeWidth={strokeWidth}
                    />
                    <motion.circle
                        className="progress-circle-fill"
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        strokeWidth={strokeWidth}
                        stroke={`url(#progressGradient-${label})`}
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
                    />
                </svg>
                <div className="progress-circle-text">
                    <div className="stat-number">{value}</div>
                    <div className="progress-circle-label">{label}</div>
                </div>
            </div>
        );
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

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4"
        >
            <div className="section-header">
                <div>
                    <h2 className="section-title">📊 Your Progress</h2>
                    <p className="section-subtitle">Track your productivity and achievements</p>
                </div>
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="stats-grid"
            >
                {/* Main Completion Rate Card */}
                <motion.div 
                    variants={statVariants}
                    className="card-stats"
                >
                    <div className="stat-item">
                        <CircularProgress 
                            percentage={completionRate}
                            label="Complete"
                            value={`${completionRate}%`}
                            size={140}
                        />
                        <div className="mt-lg">
                            <div className="text-sm text-muted">Overall Progress</div>
                        </div>
                    </div>
                </motion.div>

                {/* Total Tasks Card */}
                <motion.div 
                    variants={statVariants}
                    className="card-stats"
                >
                    <div className="stat-item">
                        <div className="icon icon-xl text-gradient mb-md">
                            📝
                        </div>
                        <div className="stat-number">{total}</div>
                        <div className="stat-label">Total Tasks</div>
                        <div className="text-sm text-muted mt-sm">
                            {getRecentActivity()} added today
                        </div>
                    </div>
                </motion.div>

                {/* Completed Tasks Card */}
                <motion.div 
                    variants={statVariants}
                    className="card-stats"
                >
                    <div className="stat-item">
                        <div className="icon icon-xl text-gradient mb-md">
                            ✅
                        </div>
                        <div className="stat-number text-gradient">{completed}</div>
                        <div className="stat-label">Completed</div>
                        <div className="text-sm text-muted mt-sm">
                            Keep up the great work!
                        </div>
                    </div>
                </motion.div>

                {/* Pending Tasks Card */}
                <motion.div 
                    variants={statVariants}
                    className="card-stats"
                >
                    <div className="stat-item">
                        <div className="icon icon-xl text-gradient mb-md">
                            ⏳
                        </div>
                        <div className="stat-number">{pending}</div>
                        <div className="stat-label">Pending</div>
                        <div className="text-sm text-muted mt-sm">
                            {pending === 0 ? "All done! 🎉" : "Focus on these next"}
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Enhanced Progress Bar Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="progress-card mt-xl"
            >
                <div className="flex justify-between items-center mb-md">
                    <h3 className="text-lg font-semibold text-primary">Daily Progress</h3>
                    <span className="text-sm text-muted">{completed} of {total} tasks</span>
                </div>
                
                <div className="relative">
                    <div className="w-full h-2 rounded-full overflow-hidden" style={{background: 'var(--glass-border)'}}>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${completionRate}%` }}
                            transition={{ duration: 1.5, ease: "easeOut", delay: 1 }}
                            className="h-full rounded-full"
                            style={{
                                background: 'linear-gradient(90deg, var(--gradient-start), var(--gradient-end))'
                            }}
                        />
                    </div>
                    <div className="flex justify-between mt-sm text-xs text-muted">
                        <span>0%</span>
                        <span className="font-medium">{completionRate}%</span>
                        <span>100%</span>
                    </div>
                </div>

                {/* Motivational Messages */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                    className="mt-lg text-center"
                >
                    {completionRate === 100 && (
                        <div className="notification notification-success">
                            <span>🎉</span>
                            <span>Amazing! You've completed all your tasks!</span>
                        </div>
                    )}
                    {completionRate >= 75 && completionRate < 100 && (
                        <div className="notification notification-info">
                            <span>🚀</span>
                            <span>You're doing great! Almost there!</span>
                        </div>
                    )}
                    {completionRate >= 50 && completionRate < 75 && (
                        <div className="notification notification-warning">
                            <span>💪</span>
                            <span>Good progress! Keep pushing forward!</span>
                        </div>
                    )}
                    {completionRate < 50 && completionRate > 0 && (
                        <div className="notification notification-info">
                            <span>⭐</span>
                            <span>Great start! Every step counts!</span>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </motion.div>
    );
}

TodoStatsEnhanced.propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        completed: PropTypes.bool,
        created_at: PropTypes.string,
        updated_at: PropTypes.string,
    })),
};
