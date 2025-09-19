const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../persistence');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const SALT_ROUNDS = 10;

// Register new user
const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // Validate input
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                message: 'All fields are required'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: 'Password must be at least 6 characters long'
            });
        }

        // Check if user already exists
        const existingUser = await db.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({
                message: 'User with this email already exists'
            });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        // Create user
        const userId = uuidv4();
        const user = {
            id: userId,
            firstName,
            lastName,
            email,
            passwordHash
        };

        await db.createUser(user);

        // Generate JWT token
        const token = jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: '7d' });

        // Return user data (without password)
        res.status(201).json({
            message: 'User created successfully',
            user: {
                id: userId,
                firstName,
                lastName,
                email
            },
            token
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            message: 'Internal server error'
        });
    }
};

// Login user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required'
            });
        }

        // Get user by email
        const user = await db.getUserByEmail(email);
        if (!user) {
            return res.status(400).json({
                message: 'Invalid email or password'
            });
        }

        // Check password
        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        if (!passwordMatch) {
            return res.status(400).json({
                message: 'Invalid email or password'
            });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

        // Return user data (without password)
        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email
            },
            token
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            message: 'Internal server error'
        });
    }
};

module.exports = { register, login };
