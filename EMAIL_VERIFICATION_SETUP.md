# 📧 Email Verification Setup Guide

## Overview
Email verification has been successfully implemented for your Sign Language Translation application. Users must now verify their email address before they can log in.

---

## ✅ What's Been Implemented

### Backend Changes

1. **Modified Registration Flow** (`server/controllers/authController.js`)
   - Users are no longer created immediately upon registration
   - Instead, a `PendingRegistration` record is created
   - Verification email is sent with a unique token (valid for 24 hours)
   - User account is only created after email verification

2. **New API Endpoints**
   - `GET /api/auth/verify-email/:token` - Verifies email and creates user account
   - `POST /api/auth/resend-verification` - Resends verification email

3. **Email Service** (`server/utils/emailService.js`)
   - Already configured with nodemailer for Gmail SMTP
   - Professional email templates with clickable buttons
   - Error handling for failed email sends

### Frontend Changes

1. **New VerifyEmail Page** (`client/src/pages/VerifyEmail.jsx`)
   - Automatically verifies token from URL
   - Shows success/error messages
   - Auto-login after successful verification
   - Resend email functionality for expired links
   - Auto-redirect to dashboard after verification

2. **Updated Register Page** (`client/src/pages/Register.jsx`)
   - Shows success message after registration
   - Displays registered email
   - Instructions to check inbox
   - Link to login page

3. **New Route** (`client/src/App.jsx`)
   - Added `/verify-email` route for email verification page

---

## 🔧 Required Configuration

### Environment Variables (Server)

You need to configure your `.env` file in the `server` directory with the following variables:

```env
# Email Configuration (Gmail SMTP)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-digit-app-password
CLIENT_URL=http://localhost:3000
```

### How to Get Gmail App Password

1. Go to your Google Account Settings: https://myaccount.google.com/
2. Navigate to **Security**
3. Enable **2-Step Verification** (if not already enabled)
4. Go to **App Passwords** (search for "app passwords" in settings)
5. Select **Mail** as the app and generate a password
6. Copy the 16-digit password (no spaces)
7. Use this as `EMAIL_PASSWORD` in your `.env` file

**Important**: Do NOT use your actual Gmail password. Use the App Password generated above.

---

## 🚀 How It Works

### Registration Flow

```
1. User fills registration form
   ↓
2. Backend creates PendingRegistration (not a full User yet)
   ↓
3. Backend sends verification email with token
   ↓
4. User receives email with verification link
   ↓
5. User clicks link → redirected to /verify-email?token=xxx
   ↓
6. Backend verifies token
   ↓
7. Backend creates actual User account
   ↓
8. User is auto-logged in
   ↓
9. User redirected to dashboard
```

### Email Template

The verification email includes:
- Welcome message
- Clickable "Verify Email" button
- Copy-paste link as backup
- Expiration notice (24 hours)
- Security note about ignoring if they didn't register

---

## 🔐 Security Features

- ✅ **Token-based verification**: Unique 32-byte cryptographically secure tokens
- ✅ **Time-limited**: Tokens expire after 24 hours
- ✅ **Auto-cleanup**: Expired pending registrations are automatically deleted
- ✅ **One-time use**: Tokens are deleted after successful verification
- ✅ **Email uniqueness**: Prevents duplicate registrations
- ✅ **Secure password storage**: Passwords are hashed with bcrypt before storage

---

## 📱 User Experience

### Success Path
1. User registers → Sees green success message
2. User checks email → Receives professional verification email
3. User clicks link → Sees verification progress spinner
4. Success! → Auto-logged in and redirected to dashboard

### Error Handling
- **Expired Token**: Shows error with option to resend email
- **Invalid Token**: Shows clear error message
- **Email Send Failure**: Deletes pending registration, asks user to try again
- **Already Verified**: Informs user email is already verified

---

## 🧪 Testing

### Test the Flow

1. **Start your server**:
   ```bash
   cd server
   npm run dev
   ```

2. **Start your client**:
   ```bash
   cd client
   npm start
   ```

3. **Register a new account**:
   - Go to http://localhost:3000/register
   - Fill in the form
   - Submit

4. **Check for success message**:
   - Should see green success box
   - Should show registered email

5. **Check your email**:
   - Open the email (check spam folder too)
   - Click the verification link

6. **Verify**:
   - Should see verification progress
   - Should see success message
   - Should auto-redirect to dashboard

### Test Resend Email

1. Wait for token to expire (or manually delete from database)
2. Try to verify with expired token
3. Should see error with resend form
4. Enter email and click "Resend Verification Email"
5. Check inbox for new email

---

## 🐛 Troubleshooting

### Email Not Sending

**Problem**: Users register but don't receive emails

**Solutions**:
1. Check `.env` file has correct `EMAIL_USER` and `EMAIL_PASSWORD`
2. Ensure Gmail App Password is being used (not regular password)
3. Check server logs for email errors
4. Verify 2-Step Verification is enabled on Gmail
5. Check if Gmail is blocking the app password

### Verification Link Not Working

**Problem**: Clicking link shows "Invalid or expired token"

**Solutions**:
1. Check if token has expired (24-hour limit)
2. Use resend email feature to get new token
3. Check database - ensure PendingRegistration exists
4. Verify `CLIENT_URL` in `.env` matches your frontend URL

### Email Goes to Spam

**Problem**: Verification emails land in spam folder

**Solutions**:
1. Add sender to contacts
2. Mark as "Not Spam"
3. In production, consider using professional email service (SendGrid, AWS SES)
4. Set up SPF, DKIM, DMARC records for your domain

---

## 🔄 API Reference

### Register User
```
POST /api/auth/register
Body: {
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "deaf"
}
Response: {
  "success": true,
  "message": "Registration successful! Please check your email...",
  "email": "john@example.com"
}
```

### Verify Email
```
GET /api/auth/verify-email/:token
Response: {
  "success": true,
  "message": "Email verified successfully! You are now logged in.",
  "user": { _id, fullName, email, role }
}
```

### Resend Verification
```
POST /api/auth/resend-verification
Body: {
  "email": "john@example.com"
}
Response: {
  "success": true,
  "message": "Verification email has been resent..."
}
```

---

## 📊 Database Schema

### PendingRegistration Model
```javascript
{
  fullName: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: student/teacher/admin/deaf),
  verificationToken: String (unique),
  verificationTokenExpires: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Note**: TTL index automatically deletes expired pending registrations.

---

## 🎨 Customization

### Change Email Template
Edit `server/utils/emailService.js` → `getVerificationEmailTemplate()` function

### Change Token Expiry
Edit `server/controllers/authController.js` → Change `24 * 60 * 60 * 1000` (24 hours)

### Change Email Provider
Replace nodemailer configuration in `server/utils/emailService.js`

---

## 🚨 Important Notes

1. **Password Validation**: Minimum 6 characters (aligned between frontend and backend)
2. **Auto-Login**: Users are automatically logged in after email verification
3. **Token Security**: Tokens are cryptographically secure random bytes
4. **No Duplicate Emails**: System prevents duplicate registrations
5. **Production Ready**: Remember to change `NODE_ENV=production` in production

---

## ✨ Features Included

- ✅ Email verification with secure tokens
- ✅ Professional email templates
- ✅ Automatic token expiration (24 hours)
- ✅ Resend verification email functionality
- ✅ Auto-login after verification
- ✅ Beautiful UI with loading states
- ✅ Error handling and user feedback
- ✅ Database cleanup for expired tokens
- ✅ Mobile-responsive design

---

## 📞 Support

If you encounter any issues:
1. Check the console logs (both frontend and backend)
2. Verify all environment variables are set correctly
3. Test with a real email address
4. Check spam/junk folder for verification emails

---

**Congratulations! Your email verification system is now fully functional! 🎉**

