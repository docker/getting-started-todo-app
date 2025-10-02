import { motion } from 'framer-motion';
import './AnimatedBackground.scss';

export const AnimatedBackground = ({ children }) => {
    // Floating particles animation
    const particles = Array.from({ length: 20 }, (_, i) => i);

    const particleVariants = {
        animate: {
            y: [0, -100, 0],
            x: [0, 100, -50, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.2, 1],
            transition: {
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 5,
            },
        },
    };

    const gradientVariants = {
        animate: {
            background: [
                "linear-gradient(45deg, #667eea 0%, #764ba2 100%)",
                "linear-gradient(45deg, #f093fb 0%, #f5576c 100%)",
                "linear-gradient(45deg, #4facfe 0%, #00f2fe 100%)",
                "linear-gradient(45deg, #43e97b 0%, #38f9d7 100%)",
                "linear-gradient(45deg, #667eea 0%, #764ba2 100%)",
                ""
            ],
            transition: {
                duration: 20,
                repeat: Infinity,
                ease: "easeInOut",
            },
        },
    };

    const waveVariants = {
        animate: {
            d: [
                "M0,32L48,80C96,128,192,224,288,224C384,224,480,128,576,90.7C672,53,768,75,864,96C960,117,1056,139,1152,149.3C1248,160,1344,160,1392,160L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                "M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
                "M0,32L48,80C96,128,192,224,288,224C384,224,480,128,576,90.7C672,53,768,75,864,96C960,117,1056,139,1152,149.3C1248,160,1344,160,1392,160L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
            ],
            transition: {
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
            },
        },
    };

    return (
        <div className="animated-background">
            {/* Animated gradient background */}
            <motion.div
                className="gradient-bg"
                variants={gradientVariants}
                animate="animate"
            />

            {/* Floating particles */}
            <div className="particles-container">
                {particles.map((particle) => (
                    <motion.div
                        key={particle}
                        className="particle"
                        variants={particleVariants}
                        animate="animate"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                    />
                ))}
            </div>

            {/* Animated waves */}
            <div className="waves-container">
                <svg
                    className="waves"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 24 150 28"
                    preserveAspectRatio="none"
                >
                    <defs>
                        <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
                            <stop offset="50%" stopColor="rgba(255,255,255,0.3)" />
                            <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
                        </linearGradient>
                    </defs>
                    <motion.path
                        fill="url(#waveGradient)"
                        variants={waveVariants}
                        animate="animate"
                    />
                </svg>
            </div>

            {/* Glass morphism overlay */}
            <div className="glass-overlay" />

            {/* Content */}
            <div className="content-wrapper">
                {children}
            </div>
        </div>
    );
};
