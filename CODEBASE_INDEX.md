# SignVerse - Codebase Index & Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Directory Structure](#directory-structure)
4. [Technology Stack](#technology-stack)
5. [Client (Frontend)](#client-frontend)
6. [Server (Backend)](#server-backend)
7. [ML Backend](#ml-backend)
8. [Key Features](#key-features)
9. [API Endpoints](#api-endpoints)
10. [Data Models](#data-models)
11. [Configuration](#configuration)
12. [Development Workflow](#development-workflow)

---

## Project Overview

**SignVerse** is a comprehensive sign language translation and learning platform that combines:
- Real-time sign language detection using ML
- Interactive learning modules
- User authentication and progress tracking
- Responsive web interface

**Vision**: Create an inclusive, accessible environment where users can learn sign language at their own pace with real-time feedback and gamified progress tracking.

**Target Users**:
- Beginners wanting to learn sign language
- Intermediate learners improving fluency
- Educators teaching sign language
- Members of deaf and hard-of-hearing community

---

## Architecture

The project follows a **three-tier architecture**:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   React Client  │────▶│  Node.js API    │     │   ML Backend    │
│   (Port 3000)   │     │   (Port 5000)   │────▶│   (Port 5001)   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                              │
                              ▼
                        ┌─────────────┐
                        │   MongoDB   │
                        └─────────────┘
```

### Communication Flow:
1. **Client ↔ Server**: RESTful API, JWT authentication via HTTP cookies
2. **Server ↔ Database**: Mongoose ODM for MongoDB operations
3. **Client ↔ ML Backend**: Direct HTTP requests for sign translation
4. **ML Backend**: Flask API with TensorFlow/MediaPipe for sign recognition

---

## Directory Structure

```
FYP/
├── client/                    # React frontend application
│   ├── public/
│   │   ├── index.html        # Main HTML template
│   │   └── manifest.json     # PWA manifest
│   ├── src/
│   │   ├── assets/           # Images and static files
│   │   ├── components/       # React components
│   │   │   ├── auth/
│   │   │   ├── common/       # Header, Footer, etc.
│   │   │   ├── layouts/      # Layout wrappers
│   │   │   └── WebcamCapture.jsx
│   │   ├── context/          # React Context providers
│   │   │   └── AuthContext.jsx
│   │   ├── pages/            # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── SignTranslation.jsx
│   │   │   └── VerifyEmail.jsx
│   │   ├── routes/           # Route protection
│   │   │   └── ProtectedRoute.jsx
│   │   ├── services/         # API service layers
│   │   │   ├── api.js
│   │   │   └── translationService.js
│   │   ├── App.jsx
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   └── tailwind.config.js
│
├── server/                    # Node.js Express backend
│   ├── config/
│   │   └── db.js             # MongoDB connection
│   ├── controllers/
│   │   └── authController.js # Authentication logic
│   ├── middlewares/
│   │   └── authMiddleware.js # JWT verification
│   ├── models/
│   │   ├── User.js           # User schema
│   │   └── PendingRegistration.js
│   ├── routes/
│   │   └── authRoutes.js     # API routes
│   ├── tests/
│   │   └── auth.test.js      # Jest tests
│   ├── utils/
│   │   └── emailService.js   # Email utilities
│   ├── server.js             # Main server file
│   └── package.json
│
├── ml_backend/                # Python Flask ML service
│   ├── models/
│   │   ├── ASL_model.h5      # TensorFlow model
│   │   └── updated_ASL_model.h5
│   ├── utils/
│   │   ├── preprocessing.py  # Image preprocessing
│   │   ├── prediction.py     # Model wrapper
│   │   └── predict.py        # Prediction logic
│   ├── debug_outputs/        # Debug images
│   ├── app.py                # Flask application
│   ├── requirements.txt      # Python dependencies
│   ├── test_model.py         # Model testing
│   └── verify_model.py       # Model verification
│
├── package.json              # Root package.json
├── README.md
├── Context.md
└── .gitignore
```

---

## Technology Stack

### Frontend
- **Framework**: React 18.2.0
- **Routing**: React Router DOM 6.10.0
- **Styling**: TailwindCSS 3.3.0 + PostCSS + Autoprefixer
- **HTTP Client**: Axios 1.3.4
- **Webcam**: react-webcam 7.2.0
- **Icons**: react-icons 5.5.0
- **Testing**: Jest, React Testing Library

### Backend (Node.js)
- **Framework**: Express.js 4.18.2
- **Database**: MongoDB with Mongoose 7.0.3
- **Authentication**: JWT (jsonwebtoken 9.0.0), bcryptjs 2.4.3
- **Security**: CORS 2.8.5, cookie-parser 1.4.7
- **Email**: Nodemailer 7.0.3
- **Environment**: dotenv 16.0.3
- **Testing**: Jest 29.5.0, Supertest 6.3.3
- **Dev Tools**: Nodemon 3.1.10

### ML Backend (Python)
- **Framework**: Flask 2.2.5
- **CORS**: flask-cors 3.0.10
- **ML Framework**: TensorFlow 2.13.0
- **Computer Vision**: OpenCV 4.8.1.78
- **Hand Detection**: MediaPipe 0.10.5
- **Numerical**: NumPy 1.24.3
- **Environment**: python-dotenv 1.0.0

### DevOps & Tools
- **Version Control**: Git
- **Package Manager**: npm
- **Process Manager**: concurrently 8.2.2
- **Build Tools**: React Scripts 5.0.1, Webpack (via CRA)

---

## Client (Frontend)

### Key Components

#### 1. **App.jsx**
- Main application component
- Configures routing with React Router
- Wraps app with AuthProvider context

**Routes:**
- `/` - Home page (public)
- `/login` - Login page (public)
- `/register` - Registration page (public)
- `/profile` - User profile (protected)
- `/translate` - Sign translation interface (protected)
- `/dashboard` - Dashboard alias for translation (protected)

#### 2. **Authentication System**

**AuthContext.jsx**
- Manages global authentication state
- Provides user data, loading state, error handling
- Methods: `login()`, `register()`, `logout()`, `checkUser()`
- Uses JWT stored in HTTP-only cookies

**ProtectedRoute.jsx**
- HOC for route protection
- Redirects unauthorized users to login
- Shows loading state during auth check

#### 3. **Pages**

**Home.jsx**
- Landing page with hero section
- Features showcase
- Call-to-action buttons
- Role-based registration links
- Responsive navigation menu

**Login.jsx**
- Email/password authentication
- Password visibility toggle
- Remember me checkbox
- Error handling and validation
- Links to registration and password reset

**Register.jsx**
- Full name, email, password, role selection
- Password confirmation
- Client-side validation (8+ chars)
- Social login placeholders (Google, Facebook)
- Role options: deaf user, student

**SignTranslation.jsx** (Main Feature Page)
- Two input modes: Real-time webcam / Upload image
- WebcamCapture component integration
- Translation results display with confidence score
- Text-to-speech functionality
- Translation history
- Error handling with troubleshooting tips

**Profile.jsx**
- Display user information
- Logout functionality
- Simple profile view

**VerifyEmail.jsx**
- Email verification flow
- Token-based verification
- Success/error states
- Auto-redirect on success

#### 4. **Components**

**WebcamCapture.jsx** (Complex Component)
- Real-time webcam streaming
- MediaPipe hand detection with landmarks
- Fallback motion detection
- Visual feedback (hand detection overlay)
- Frame capture every 2 seconds
- Canvas overlay for hand tracking
- Error handling for webcam access

**Header.jsx / AuthHeader.jsx**
- Navigation bar
- Logo and branding
- Responsive mobile menu
- Authentication links

**Footer.jsx**
- Site links (terms, privacy, help)
- Social media links
- Contact information
- Copyright notice

**AuthLayout.jsx**
- Simple centered layout wrapper
- Used for login/register pages

#### 5. **Services**

**api.js**
- Axios instance configuration
- Base URL: `http://localhost:5000/api`
- Credentials included for cookies
- Response/error interceptors
- Auth endpoints:
  - `register(userData)`
  - `login(credentials)`
  - `logout()`
  - `getCurrentUser()`

**translationService.js**
- ML backend communication
- Base URL: `http://localhost:5001/api`
- Methods:
  - `translateImage(imageData)` - For uploaded images
  - `translateRealtimeImage(imageData)` - For webcam frames
  - `sendFeedback(feedbackData)` - Submit feedback

#### 6. **Styling**

**index.css**
- TailwindCSS directives
- Custom component classes
  - `.btn-primary` - Primary button styles
  - `.input-field` - Form input styles
- Inter font family
- Gray background base

**tailwind.config.js**
- Content paths for purging
- Theme extensions
- Important flag enabled

---

## Server (Backend)

### Server Architecture

**server.js** - Main Entry Point
- Express application setup
- Middleware configuration (CORS, body parser, cookies)
- Database connection
- Route mounting
- Global error handler
- Server listening on port 5000

### Controllers

**authController.js**
- `register()` - Create new user, generate JWT, set cookie
- `login()` - Verify credentials, update last login, set cookie
- `logout()` - Clear auth cookie
- `getMe()` - Get current authenticated user
- JWT token generation helper

### Middlewares

**authMiddleware.js**
- `protect()` - Verify JWT from cookie, attach user to request
- `admin()` - Check for admin role
- Token validation and error handling

### Models

**User.js** (Mongoose Schema)
```javascript
{
  fullName: String (required, trimmed)
  email: String (required, unique, validated, lowercase)
  password: String (required, hashed, select: false)
  role: Enum ['student', 'teacher', 'admin', 'deaf'] (required)
  isEmailVerified: Boolean (default: false)
  lastLogin: Date
  timestamps: true (createdAt, updatedAt)
}
```

**Pre-save Hooks:**
- Password hashing with bcrypt (10 salt rounds)

**Methods:**
- `comparePassword(enteredPassword)` - Compare password hash

**PendingRegistration.js** (Mongoose Schema)
```javascript
{
  fullName: String (required)
  email: String (required, unique)
  password: String (required)
  role: String (required)
  verificationToken: String (required, unique)
  verificationTokenExpires: Date (required)
  timestamps: true
}
```

**Indexes:**
- verificationToken (fast lookup)
- email (fast lookup)
- TTL index on verificationTokenExpires (auto-delete expired)

### Routes

**authRoutes.js**
- `POST /api/auth/register` - Public registration
- `POST /api/auth/login` - Public login
- `POST /api/auth/logout` - Public logout
- `GET /api/auth/me` - Protected, get current user

### Configuration

**db.js**
- MongoDB connection using Mongoose
- Connection options: useNewUrlParser, useUnifiedTopology
- Error handling and process exit on failure

### Utilities

**emailService.js**
- Nodemailer transporter (Gmail SMTP)
- `sendVerificationEmail(email, token)` - Send verification link
- HTML email template
- 24-hour token expiration

### Testing

**auth.test.js** (Jest + Supertest)
- Registration tests
  - Successful registration
  - Duplicate email rejection
- Login tests
  - Valid credentials
  - Invalid password
- Protected route tests
  - Access with token
  - Access without token
- Logout tests

**testDb.js**
- Database connection verification script

---

## ML Backend

### Flask Application

**app.py** - Main Flask Server
- CORS enabled for client requests
- Two main endpoints for translation
- File size limit: 2MB
- Supported formats: PNG, JPG, JPEG
- Logging configuration
- Debug mode enabled

### Endpoints

#### 1. **POST /api/translate**
Purpose: Image upload translation
- Accepts file upload or base64 image
- File validation (type, size)
- Preprocessing **without** hand detection (assumes focused images)
- Returns: predicted_sign, confidence, status

#### 2. **POST /api/translate/realtime**
Purpose: Real-time webcam translation
- Accepts base64 encoded images
- Preprocessing **with** hand detection (full scene images)
- Optimized for frequent requests
- Returns: predicted_sign, confidence, status

### Preprocessing Pipeline

**preprocessing.py**

**detect_hand()** - Hand Detection
- Uses MediaPipe Hands solution
- Detects hand landmarks
- Calculates bounding box with padding
- Fallback: flip image and retry
- Returns cropped hand ROI or error

**preprocess_image()** - Image Preprocessing
- Optional hand detection (controlled by `detect` parameter)
- Color space conversions (BGR → RGB)
- Resize to 200x200
- Normalization (0-1 range)
- Add batch dimension
- Debug image saving

**robust_preprocess_image()** - Robust Wrapper
- Auto-retry with max attempts (default: 3)
- Attempt 1: Original image
- Attempt 2: Histogram equalization enhancement
- Attempt 3: Full image without hand detection
- Collects error details across attempts

### Prediction

**predict.py** - Main Prediction Module
- Model loaded once globally (singleton pattern)
- Thread-safe loading with locks
- Model path: `models/ASL_model.h5`
- Classes: 0-9, a-z (36 total)

**predict_sign()** - Prediction Function
- Input: Preprocessed tensor (1, 200, 200, 3)
- Output: predicted_sign (str), confidence (float)
- Logging for debugging

**prediction.py** - SignPredictor Class
- Alternative prediction wrapper
- Model loading with custom objects
- Model compilation
- Index to label mapping

### Model Details

**ASL_model.h5**
- TensorFlow/Keras model
- Input shape: (200, 200, 3) RGB images
- Output: 36 classes (digits + alphabet)
- Architecture: CNN (specific details in model file)

**Class Labels:**
```python
CLASSES = [
    "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
    "a", "b", "c", "d", "e", "f", "g", "h", "i", "j",
    "k", "l", "m", "n", "o", "p", "q", "r", "s", "t",
    "u", "v", "w", "x", "y", "z"
]
```

### Testing & Verification

**test_model.py**
- Model loading verification
- Random input prediction test
- Success/failure reporting

**verify_model.py**
- Uses SignPredictor class
- Dummy input testing
- Environment variable validation

### Debug Features

**debug_outputs/** Directory
- Saves preprocessed images
- `last_processed_for_model_rgb.jpg` - Last image sent to model
- Helps debug preprocessing issues

---

## Key Features

### 1. **User Authentication**
- JWT-based authentication
- HTTP-only cookies for security
- Role-based access (student, teacher, admin, deaf)
- Password hashing with bcrypt
- Protected routes
- Session persistence (30 days)

### 2. **Sign Language Translation**

**Real-time Mode:**
- Webcam capture every 2 seconds
- MediaPipe hand landmark detection
- Visual feedback with hand overlay
- Motion-based fallback detection
- Confidence score display
- Translation history

**Upload Mode:**
- Image file upload
- Drag-and-drop support
- Instant translation
- Result display with image preview
- Text-to-speech output

### 3. **Hand Detection**

**MediaPipe Integration:**
- 21 hand landmark points
- Bounding box calculation
- Yellow overlay visualization
- Detection status display
- Fallback to motion detection

**Motion Detection Fallback:**
- Frame difference analysis
- Bounding box on motion regions
- Less accurate but functional backup

### 4. **ML Model**
- TensorFlow CNN model
- 36 classes (0-9, a-z)
- 200x200 RGB input
- Confidence scoring
- Optimized for real-time inference

### 5. **UI/UX Features**
- Responsive design (mobile-first)
- TailwindCSS styling
- Loading states
- Error handling with troubleshooting
- Translation history
- Text-to-speech
- Mode switching (realtime/upload)

---

## API Endpoints

### Backend Server (Port 5000)

#### Authentication

**POST /api/auth/register**
```json
Request:
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "deaf" | "student" | "teacher" | "admin"
}

Response (201):
{
  "success": true,
  "_id": "user_id",
  "fullName": "John Doe",
  "email": "john@example.com",
  "role": "deaf"
}
```

**POST /api/auth/login**
```json
Request:
{
  "email": "john@example.com",
  "password": "password123"
}

Response (200):
{
  "_id": "user_id",
  "fullName": "John Doe",
  "email": "john@example.com",
  "role": "deaf",
  "isVerified": true
}
```

**POST /api/auth/logout**
```json
Response (200):
{
  "message": "Logged out successfully"
}
```

**GET /api/auth/me** (Protected)
```json
Response (200):
{
  "_id": "user_id",
  "fullName": "John Doe",
  "email": "john@example.com",
  "role": "deaf",
  "isVerified": true
}
```

### ML Backend (Port 5001)

#### Translation

**POST /api/translate**
```json
Request (multipart/form-data or JSON):
{
  "image": "data:image/jpeg;base64,..." // base64 string
}
// OR
FormData with 'image' file field

Response (200):
{
  "predicted_sign": "a",
  "confidence": 0.95,
  "status": "success"
}

Error Response (400):
{
  "error": "No hand detected",
  "details": ["Attempt 1: ...", "Attempt 2: ..."]
}
```

**POST /api/translate/realtime**
```json
Request:
{
  "image": "data:image/jpeg;base64,..."
}

Response (200):
{
  "predicted_sign": "b",
  "confidence": 0.87,
  "status": "success"
}
```

---

## Data Models

### User Model
- **Collection**: users
- **Unique Fields**: email
- **Indexed Fields**: email
- **Password**: Hashed, not returned by default
- **Timestamps**: Automatic createdAt/updatedAt

### PendingRegistration Model
- **Collection**: pendingregistrations
- **Unique Fields**: email, verificationToken
- **Indexed Fields**: email, verificationToken, verificationTokenExpires
- **TTL**: Auto-delete expired entries
- **Purpose**: Email verification workflow

---

## Configuration

### Environment Variables

**Client** (.env in client/)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

**Server** (.env in server/)
```env
MONGO_URI=mongodb://localhost:27017/signverse
JWT_SECRET=your_jwt_secret_key
PORT=5000
CLIENT_URL=http://localhost:3000
NODE_ENV=development
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_app_password
```

**ML Backend** (.env in ml_backend/)
```env
MODEL_PATH=models/ASL_model.h5
PORT=5001
CLIENT_URL=http://localhost:3000
```

### Package Scripts

**Root package.json**
```bash
npm run client      # Start client only
npm run server      # Start server only
npm run dev         # Start both concurrently
npm run install-all # Install all dependencies
```

**Client package.json**
```bash
npm start          # Development server
npm build          # Production build
npm test           # Run tests
npm eject          # Eject from CRA
```

**Server package.json**
```bash
npm start          # Production server
npm run dev        # Development with nodemon
npm test           # Run Jest tests
```

**ML Backend**
```bash
python app.py                    # Start Flask server
python test_model.py             # Test model loading
python verify_model.py           # Verify model
python -m venv venv              # Create virtual environment
source venv/bin/activate         # Activate venv (Unix)
venv\Scripts\activate            # Activate venv (Windows)
pip install -r requirements.txt  # Install dependencies
```

---

## Development Workflow

### Initial Setup

1. **Clone Repository**
```bash
git clone <repository-url>
cd FYP
```

2. **Install Root Dependencies**
```bash
npm install
```

3. **Install All Project Dependencies**
```bash
npm run install-all
```

4. **Setup Environment Files**
- Create `.env` files in `server/` and `ml_backend/`
- Add required environment variables

5. **Setup Python Virtual Environment**
```bash
cd ml_backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
cd ..
```

6. **Start Development Servers**
```bash
# Terminal 1: Start Node.js backend and React frontend
npm run dev

# Terminal 2: Start ML backend
cd ml_backend
source venv/bin/activate
python app.py
```

### Development URLs
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- ML API: http://localhost:5001

### Testing

**Backend Tests**
```bash
cd server
npm test
```

**ML Model Tests**
```bash
cd ml_backend
python test_model.py
python verify_model.py
```

### Code Style & Conventions

**JavaScript/React:**
- camelCase for variables and functions
- PascalCase for components
- kebab-case for file names
- 2-space indentation
- Functional components with hooks

**Python:**
- snake_case for variables and functions
- PascalCase for classes
- 4-space indentation
- Type hints encouraged
- Docstrings for functions

### Git Workflow
- Feature branches from main
- Descriptive commit messages
- Pull requests for code review
- .gitignore excludes node_modules, venv, .env, etc.

---

## Security Considerations

### Current Implementation
- JWT stored in HTTP-only cookies (XSS protection)
- Password hashing with bcrypt
- CORS configuration
- Input validation on forms
- File size limits for uploads
- Environment variable protection

### Recommendations for Production
- HTTPS enforcement
- Rate limiting on APIs
- CSRF protection
- Helmet.js for headers
- Input sanitization
- SQL injection protection (using Mongoose)
- Regular dependency updates
- Security audits

---

## Performance Optimizations

### Current
- Model loaded once and cached (ML backend)
- Frame capture throttled (2 seconds)
- Image size limits (2MB)
- Efficient preprocessing pipeline
- Database indexing

### Potential Improvements
- Image compression before upload
- Model quantization
- Redis caching for sessions
- CDN for static assets
- Code splitting in React
- Lazy loading of components
- Service workers for PWA
- Database query optimization

---

## Known Issues & Limitations

1. **Hand Detection**: May struggle with poor lighting or complex backgrounds
2. **Model Accuracy**: Limited to 36 classes (digits + alphabet)
3. **Real-time Processing**: 2-second delay between captures
4. **Email Verification**: Currently disabled (users auto-verified)
5. **Single Sign**: Model predicts one sign at a time, no sentences
6. **Browser Compatibility**: Webcam features require modern browsers
7. **MediaPipe Loading**: CDN-based, may fail without internet

---

## Future Enhancements

### Planned Features
- [ ] Sentence formation from multiple signs
- [ ] Video translation (continuous sign stream)
- [ ] Learning modules with lessons
- [ ] Practice exercises and quizzes
- [ ] Achievement and badge system
- [ ] User progress tracking
- [ ] Social features (community hub)
- [ ] Sign language dictionary
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Offline mode with service workers
- [ ] Admin dashboard
- [ ] Analytics and reporting

### Technical Improvements
- [ ] Microservices architecture
- [ ] GraphQL API
- [ ] Real-time WebSocket updates
- [ ] Advanced model (multi-sign, contextual)
- [ ] Cloud deployment (AWS/Azure/GCP)
- [ ] CI/CD pipeline
- [ ] Docker containerization
- [ ] Kubernetes orchestration
- [ ] Automated testing (E2E)
- [ ] Performance monitoring
- [ ] Error tracking (Sentry)

---

## Troubleshooting Guide

### Common Issues

**1. MongoDB Connection Failed**
```
Solution:
- Check MONGO_URI in .env
- Ensure MongoDB is running
- Verify network connectivity
- Check firewall settings
```

**2. ML Model Not Found**
```
Solution:
- Verify MODEL_PATH in .env
- Check models/ directory exists
- Ensure ASL_model.h5 is present
- Check file permissions
```

**3. Webcam Access Denied**
```
Solution:
- Grant browser camera permissions
- Check HTTPS (required for webcam)
- Try different browser
- Check OS permissions
```

**4. Hand Not Detected**
```
Solution:
- Improve lighting
- Use plain background
- Position hand clearly in frame
- Move hand slowly
- Ensure hand is visible
```

**5. Port Already in Use**
```
Solution:
# Find and kill process
lsof -i :3000  # or :5000, :5001
kill -9 <PID>

# Or change port in .env
```

**6. CORS Errors**
```
Solution:
- Check CLIENT_URL in server .env
- Verify CORS origin in app.py
- Ensure withCredentials: true in axios
```

---

## Contributing Guidelines

### How to Contribute
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Review Process
- All PRs require review
- Tests must pass
- Code style must match conventions
- Documentation must be updated
- No merge conflicts

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Contact & Support

- **Email**: info@signverse.com
- **GitHub**: https://github.com/signverse
- **Documentation**: [Link to docs]
- **Issue Tracker**: [Link to issues]

---

## Acknowledgments

- MediaPipe by Google for hand detection
- TensorFlow for ML framework
- React community for excellent tools
- MongoDB for database solution
- All contributors and testers

---

**Last Updated**: October 27, 2025
**Version**: 1.0.0
**Maintained By**: SignVerse Team

