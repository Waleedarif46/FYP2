# 🚀 SignVerse - Complete Setup & Run Instructions

## Prerequisites

Before starting, ensure you have the following installed on your system:

### Required Software
- **Node.js** (v16.0.0 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (v4.0 or higher) - [Download here](https://www.mongodb.com/try/download/community)
- **Python** (v3.10 or higher) - [Download here](https://www.python.org/downloads/)
- **npm** (comes with Node.js)
- **Git** (optional, for cloning)

### Verify Installation
Open your terminal/command prompt and run:

```bash
node --version    # Should show v16.0.0 or higher
npm --version     # Should show 8.0.0 or higher
python --version  # Should show 3.10.0 or higher
mongod --version  # Should show MongoDB version
```

---

## 📥 Step 1: Get the Project

Navigate to your project directory:

```bash
cd C:\Users\HomePC\Desktop\FYP
```

---

## 🔧 Step 2: Install Dependencies

### 2.1 Install Root Dependencies

```bash
npm install
```

### 2.2 Install Client Dependencies

```bash
cd client
npm install
cd ..
```

### 2.3 Install Server Dependencies

```bash
cd server
npm install
cd ..
```

### 2.4 Install ML Backend Dependencies (Python)

```bash
cd ml_backend

# Create a virtual environment (recommended)
python -m venv venv

# Activate the virtual environment
# For Windows:
venv\Scripts\activate
# For Mac/Linux:
# source venv/bin/activate

# Install Python packages
pip install -r requirements.txt

cd ..
```

> **Note:** Keep the virtual environment activated for running the ML backend.

---

## ⚙️ Step 3: Configure Environment Variables

### 3.1 Server Configuration

Create a `.env` file in the `server` directory:

```bash
cd server
```

Create a file named `.env` and add:

```env
# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/signverse

# JWT Secret (change this to a random string)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Server Port
PORT=5000

# Client URL (for CORS)
CLIENT_URL=http://localhost:3000

# Node Environment
NODE_ENV=development

# Email Configuration (optional - for email verification)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
```

> **Important:** 
> - Replace `JWT_SECRET` with a strong random string
> - Email configuration is optional if you're not using email verification

### 3.2 ML Backend Configuration

Create a `.env` file in the `ml_backend` directory:

```bash
cd ../ml_backend
```

Create a file named `.env` and add:

```env
# Model Configuration
MODEL_PATH=models/ASL_model.h5

# Server Port
PORT=5001

# Client URL (for CORS)
CLIENT_URL=http://localhost:3000
```

---

## 🗄️ Step 4: Start MongoDB

### Option A: MongoDB as a Service (Windows)

If MongoDB is installed as a service, it should already be running. Verify with:

```bash
# Check if MongoDB is running
sc query MongoDB
```

### Option B: Manual Start

If MongoDB is not running as a service:

```bash
# Open a NEW terminal window and run:
mongod

# OR specify a data directory:
mongod --dbpath "C:\data\db"
```

> **Note:** Keep this terminal window open while using the application.

### Verify MongoDB Connection

```bash
# In a new terminal:
mongo
# OR
mongosh

# You should see a MongoDB shell prompt
```

---

## 🎬 Step 5: Run the Application

You'll need **THREE** terminal windows to run all services.

### Terminal 1: Start Backend + Frontend (Concurrently)

From the project root directory:

```bash
cd C:\Users\HomePC\Desktop\FYP
npm run dev
```

This will start:
- ✅ **Backend API** on `http://localhost:5000`
- ✅ **React Frontend** on `http://localhost:3000`

You should see output like:
```
[server] Server running on port 5000
[client] webpack compiled successfully
[client] On Your Network:  http://192.168.x.x:3000/
```

### Terminal 2: Start ML Backend

Open a **NEW** terminal window:

```bash
cd C:\Users\HomePC\Desktop\FYP\ml_backend

# Activate virtual environment
venv\Scripts\activate

# Start Flask server
python app.py
```

You should see:
```
* Running on http://0.0.0.0:5001
* Running on http://127.0.0.1:5001
```

---

## 🌐 Step 6: Access the Application

Open your web browser and navigate to:

```
http://localhost:3000
```

### What You'll See:

1. **Home Page** - Landing page with features
2. **Register** - Create a new account
3. **Login** - Sign in with your credentials
4. **Translate** - Main translation interface (requires login)

---

## 🧪 Step 7: Test the Application

### Create a Test Account

1. Click **"Get Started"** or **"Register"**
2. Fill in the form:
   - Full Name: `Test User`
   - Email: `test@example.com`
   - Password: `password123`
   - Role: Select `Student` or `Deaf User`
3. Click **"Sign Up"**
4. You'll be automatically logged in and redirected

### Test Translation Features

#### Real-time Mode:
1. Go to **Translate** page
2. Ensure **"Real-Time Mode"** is selected
3. Click **"Start Real-time Translation"**
4. Allow camera access when prompted
5. Show a hand sign to the camera
6. Wait 2 seconds for automatic capture and translation

#### Upload Mode:
1. Switch to **"Upload Image"** mode
2. Click the upload area
3. Select an image of a sign language gesture
4. View the translation result

---

## 📊 Verify All Services Are Running

### Check Backend API
Open browser or use curl:
```bash
curl http://localhost:5000/api/auth/me
```
Should return: `{"success":false,"message":"Not authorized"}`

### Check ML Backend
```bash
curl http://localhost:5001/
```
Should return: `404` (expected, as there's no root route)

### Check Frontend
Navigate to `http://localhost:3000` - should show the SignVerse homepage.

---

## 🛑 Stopping the Application

### Stop All Services:

1. **Terminal 1 (Frontend + Backend):**
   - Press `Ctrl + C`
   - Confirm with `Y` if prompted

2. **Terminal 2 (ML Backend):**
   - Press `Ctrl + C`

3. **MongoDB** (if running manually):
   - Press `Ctrl + C` in the MongoDB terminal

### Deactivate Python Virtual Environment:
```bash
deactivate
```

---

## 🔄 Quick Start Script (Optional)

For future runs, you can create a batch file to automate startup.

Create `start.bat` in the project root:

```batch
@echo off
echo Starting SignVerse Application...

:: Start MongoDB (if not running as service)
:: start cmd /k "mongod"

:: Start Backend + Frontend
start cmd /k "npm run dev"

:: Wait a few seconds
timeout /t 5

:: Start ML Backend
start cmd /k "cd ml_backend && venv\Scripts\activate && python app.py"

echo All services started!
echo Frontend: http://localhost:3000
echo Backend: http://localhost:5000
echo ML API: http://localhost:5001
```

Run with:
```bash
start.bat
```

---

## 🐛 Troubleshooting

### Problem: "Port already in use"

**Solution:**
```bash
# Find and kill the process using the port
# For port 3000:
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

# For port 5000:
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# For port 5001:
netstat -ano | findstr :5001
taskkill /PID <PID_NUMBER> /F
```

### Problem: "Cannot connect to MongoDB"

**Solutions:**
1. Check if MongoDB is running:
   ```bash
   sc query MongoDB
   ```

2. Start MongoDB service:
   ```bash
   net start MongoDB
   ```

3. Or run manually:
   ```bash
   mongod --dbpath "C:\data\db"
   ```

### Problem: "Module not found" errors

**Solution:**
```bash
# Reinstall all dependencies
npm run install-all

# Or install individually:
cd client && npm install
cd ../server && npm install
cd ../ml_backend && pip install -r requirements.txt
```

### Problem: "Python module not found"

**Solution:**
```bash
cd ml_backend
venv\Scripts\activate
pip install -r requirements.txt --force-reinstall
```

### Problem: "Camera not working"

**Solutions:**
1. Ensure you're using HTTPS or localhost (browsers require this for camera access)
2. Check browser permissions (allow camera access)
3. Try a different browser (Chrome recommended)
4. Check if another application is using the camera

### Problem: "Hand not detected"

**Solutions:**
1. Ensure good lighting
2. Use a plain/contrasting background
3. Position your hand clearly in frame
4. Move your hand slowly
5. Try the Upload mode instead

### Problem: "Model file not found"

**Solution:**
```bash
# Verify model file exists
dir ml_backend\models\ASL_model.h5

# If missing, check if it was uploaded correctly
# The model file should be ~50-100MB
```

### Problem: "CORS errors in browser console"

**Solution:**
1. Verify `CLIENT_URL` in `.env` files matches `http://localhost:3000`
2. Restart all servers after changing `.env` files
3. Clear browser cache

---

## 📝 Testing the Installation

### Run Backend Tests
```bash
cd server
npm test
```

### Test ML Model
```bash
cd ml_backend
venv\Scripts\activate
python test_model.py
python verify_model.py
```

---

## 🎯 Quick Reference

### Directory Structure
```
FYP/
├── client/          # React frontend (Port 3000)
├── server/          # Node.js backend (Port 5000)
├── ml_backend/      # Flask ML API (Port 5001)
├── package.json     # Root package file
└── README.md        # Project documentation
```

### Important Commands

| Task | Command |
|------|---------|
| Start All (Dev) | `npm run dev` (from root) |
| Start Client Only | `cd client && npm start` |
| Start Server Only | `cd server && npm run dev` |
| Start ML Backend | `cd ml_backend && python app.py` |
| Install All Deps | `npm run install-all` |
| Run Tests | `cd server && npm test` |

### Important URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000 |
| ML API | http://localhost:5001 |
| MongoDB | mongodb://localhost:27017 |

---

## 🎓 First Time User Guide

1. **Register an account** at http://localhost:3000/register
2. **Login** with your credentials
3. **Navigate to Translate** page
4. **Choose a mode:**
   - **Real-time**: Use your webcam for live translation
   - **Upload**: Upload images of sign language gestures
5. **View results** including confidence scores
6. **Check history** of recent translations

---

## 🔐 Default Test Credentials

You can create any account you want. Suggested test account:

- **Email:** test@signverse.com
- **Password:** Test@123
- **Full Name:** Test User
- **Role:** Student

---

## 📞 Need Help?

If you encounter issues not covered in troubleshooting:

1. Check the console logs in all terminal windows
2. Check browser console (F12) for frontend errors
3. Verify all `.env` files are properly configured
4. Ensure all services are running (3 terminals)
5. Check MongoDB is running and accessible

---

## ✅ Success Checklist

Before starting, ensure:
- [ ] Node.js installed (v16+)
- [ ] Python installed (v3.10+)
- [ ] MongoDB installed and running
- [ ] All dependencies installed
- [ ] `.env` files created in `server/` and `ml_backend/`
- [ ] Virtual environment created and activated
- [ ] All three services started (Frontend, Backend, ML)
- [ ] Can access http://localhost:3000

---

**🎉 Congratulations! Your SignVerse application should now be running successfully!**

For more information, see:
- `README.md` - Project overview
- `CODEBASE_INDEX.md` - Detailed technical documentation
- `Context.md` - Project context and goals

