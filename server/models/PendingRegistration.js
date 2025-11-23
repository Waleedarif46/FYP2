const mongoose = require('mongoose');

const pendingRegistrationSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['student', 'teacher', 'admin', 'deaf']
    },
    verificationToken: {
        type: String,
        required: true,
        unique: true
    },
    verificationTokenExpires: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});

// Add index for faster queries
pendingRegistrationSchema.index({ verificationToken: 1 });
pendingRegistrationSchema.index({ email: 1 });

// Add TTL index to automatically delete expired registrations
pendingRegistrationSchema.index(
    { verificationTokenExpires: 1 },
    { expireAfterSeconds: 0 }
);

module.exports = mongoose.model('PendingRegistration', pendingRegistrationSchema); 