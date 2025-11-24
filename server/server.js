const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

const defaultOrigins = [
    process.env.CLIENT_URL,
    ...((process.env.CLIENT_URLS || '').split(',').map(origin => origin.trim()).filter(Boolean)),
    'http://localhost:3000',
    'http://127.0.0.1:3000'
].filter(Boolean);

const uniqueOrigins = [...new Set(defaultOrigins)];

const isLocalNetworkOrigin = (origin = '') => {
    return /^http:\/\/(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[01])\.)/i.test(origin);
};

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);

        if (uniqueOrigins.includes(origin) || isLocalNetworkOrigin(origin)) {
            return callback(null, true);
        }

        console.warn(`Blocked CORS origin: ${origin}`);
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    console.error('Error stack:', err.stack);
    
    res.status(500).json({
        success: false,
        message: err.message || 'Something went wrong on the server',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 