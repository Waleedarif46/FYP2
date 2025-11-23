# SignVerse

SignVerse is a comprehensive platform for Sign Language Detection and Learning, designed to make sign language education more accessible and interactive.

> **🚀 New User?** Start here: **[START_HERE.md](START_HERE.md)** for quick setup instructions!

## Features

- Real-time sign language detection
- Interactive learning modules
- User authentication and progress tracking
- Responsive web interface

## Tech Stack

- **Frontend**: React.js, TailwindCSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT

## Project Structure

```
signverse/
├── client/           # React frontend
├── server/           # Node.js backend
├── .env              # Environment variables
└── package.json      # Root package.json
```

## 🚀 Quick Start

### Windows Users (Easiest Way)
Simply **double-click** `START.bat` in the project root. That's it! 🎉

The browser will automatically open to http://localhost:3000

### All Platforms (Manual Method)

**Step 1: Install Dependencies**
```bash
npm run install-all

cd ml_backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Mac/Linux
pip install -r requirements.txt
cd ..
```

**Step 2: Configure Environment**

Create `server/.env`:
```env
MONGO_URI=mongodb://localhost:27017/signverse
JWT_SECRET=your_random_secret_key_here
PORT=5000
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

Create `ml_backend/.env`:
```env
MODEL_PATH=models/ASL_model.h5
PORT=5001
CLIENT_URL=http://localhost:3000
```

**Step 3: Start MongoDB**
```bash
# Windows
net start MongoDB

# Mac
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

**Step 4: Run the Application**

Open **2 terminal windows**:

**Terminal 1:**
```bash
npm run dev
```

**Terminal 2:**
```bash
cd ml_backend
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Mac/Linux
python app.py
```

**Step 5: Access Application**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- ML API: http://localhost:5001

---

## 📚 Documentation

- **[QUICK_START.md](QUICK_START.md)** - Fast setup for experienced users
- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Comprehensive installation guide
- **[STARTUP_GUIDE.txt](STARTUP_GUIDE.txt)** - Visual startup process
- **[CHECKLIST.md](CHECKLIST.md)** - Setup verification checklist
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Common issues and solutions
- **[CODEBASE_INDEX.md](CODEBASE_INDEX.md)** - Technical documentation

---

## Prerequisites

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **Python** (v3.10 or higher) - [Download](https://www.python.org/)
- **MongoDB** (v4.0 or higher) - [Download](https://www.mongodb.com/)
- **npm** (comes with Node.js)

## API Endpoints

- POST /api/register - User registration
- POST /api/login - User authentication
- GET /api/profile - Get user profile (protected)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 