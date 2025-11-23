const User = require('../models/User');
const PendingRegistration = require('../models/PendingRegistration');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendVerificationEmail } = require('../utils/emailService');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @desc    Register user (creates pending registration and sends verification email)
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
    try {
        console.log('Registration attempt with data:', JSON.stringify(req.body));
        const { fullName, email, password, role } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            console.log(`User with email ${email} already exists`);
            return res.status(400).json({ 
                success: false,
                message: 'User already exists' 
            });
        }

        // Check if pending registration exists
        const pendingExists = await PendingRegistration.findOne({ email });
        if (pendingExists) {
            // Delete old pending registration
            await PendingRegistration.findByIdAndDelete(pendingExists._id);
        }

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Create pending registration
        console.log('Creating pending registration with role:', role);
        const pendingRegistration = await PendingRegistration.create({
            fullName,
            email,
            password,
            role,
            verificationToken,
            verificationTokenExpires
        });

        console.log(`Pending registration created with ID: ${pendingRegistration._id}`);

        // Send verification email
        try {
            await sendVerificationEmail(email, verificationToken);
            console.log(`Verification email sent to: ${email}`);
        } catch (emailError) {
            console.error('Error sending verification email:', emailError);
            // Delete pending registration if email fails
            await PendingRegistration.findByIdAndDelete(pendingRegistration._id);
            return res.status(500).json({
                success: false,
                message: 'Failed to send verification email. Please try again later.'
            });
        }

        res.status(201).json({
            success: true,
            message: 'Registration successful! Please check your email to verify your account.',
            email: email
        });
    } catch (error) {
        console.error('Registration error:', error);
        console.error('Full error stack:', error.stack);
        
        // Send more detailed error information
        let errorMessage = error.message;
        if (error.code === 11000) {
            errorMessage = 'Email already in use. Please try a different email.';
        }
        
        res.status(500).json({ 
            success: false,
            message: errorMessage
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Update last login
        user.lastLogin = Date.now();
        await user.save();

        // Generate token
        const token = generateToken(user._id);

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        res.json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            isVerified: user.isEmailVerified
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0)
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            isVerified: user.isEmailVerified
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Change user password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Validation
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ 
                success: false,
                message: 'Please provide both current and new password' 
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ 
                success: false,
                message: 'New password must be at least 6 characters' 
            });
        }

        // Get user with password field
        const user = await User.findById(req.user.id).select('+password');

        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        // Verify current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false,
                message: 'Current password is incorrect' 
            });
        }

        // Update password (pre-save hook will hash it)
        user.password = newPassword;
        await user.save();

        res.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// @desc    Verify email with token
// @route   GET /api/auth/verify-email/:token
// @access  Public
const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;

        // Find pending registration with this token
        const pendingRegistration = await PendingRegistration.findOne({ 
            verificationToken: token,
            verificationTokenExpires: { $gt: Date.now() }
        });

        if (!pendingRegistration) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid or expired verification token' 
            });
        }

        // Create actual user account
        const newUser = await User.create({
            fullName: pendingRegistration.fullName,
            email: pendingRegistration.email,
            password: pendingRegistration.password,
            role: pendingRegistration.role,
            isEmailVerified: true
        });

        // Delete pending registration
        await PendingRegistration.findByIdAndDelete(pendingRegistration._id);

        // Generate token for auto-login
        const authToken = generateToken(newUser._id);

        // Set cookie
        res.cookie('token', authToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        console.log(`Email verified and user created: ${newUser._id}`);

        res.json({
            success: true,
            message: 'Email verified successfully! You are now logged in.',
            user: {
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        console.error('Email verification error:', error);
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Public
const resendVerification = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ 
                success: false,
                message: 'Email is required' 
            });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ 
                success: false,
                message: 'This email is already verified' 
            });
        }

        // Find pending registration
        const pendingRegistration = await PendingRegistration.findOne({ email });
        if (!pendingRegistration) {
            return res.status(404).json({ 
                success: false,
                message: 'No pending registration found for this email' 
            });
        }

        // Generate new verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Update pending registration
        pendingRegistration.verificationToken = verificationToken;
        pendingRegistration.verificationTokenExpires = verificationTokenExpires;
        await pendingRegistration.save();

        // Send verification email
        await sendVerificationEmail(email, verificationToken);
        console.log(`Verification email resent to: ${email}`);

        res.json({
            success: true,
            message: 'Verification email has been resent. Please check your inbox.'
        });
    } catch (error) {
        console.error('Resend verification error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to resend verification email. Please try again later.' 
        });
    }
};

module.exports = {
    register,
    login,
    logout,
    getMe,
    changePassword,
    verifyEmail,
    resendVerification
}; 