# ⚡ SignVerse - Quick Start

## 🚀 Fast Setup (Windows)

**Just run:** Double-click `START.bat`

## 🔧 Manual Setup

### 1. Install Dependencies

```bash
# Root and client/server
npm run install-all

# Python packages
cd ml_backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

### 2. Create Environment Files

**`server/.env`:**
```env
MONGO_URI=mongodb://localhost:27017/signverse
JWT_SECRET=your_secret_key
PORT=5000
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

**`ml_backend/.env`:**
```env
MODEL_PATH=models/ASL_model.h5
PORT=5001
CLIENT_URL=http://localhost:3000
```

### 3. Start MongoDB

```bash
net start MongoDB    # Windows
```

### 4. Run Application

**Terminal 1:**
```bash
npm run dev
```

**Terminal 2:**
```bash
cd ml_backend
venv\Scripts\activate
python app.py
```

### 5. Access

Open http://localhost:3000

---

## 🐛 Common Issues

**TensorFlow won't install:** Already fixed in requirements.txt (v2.15.0)

**MongoDB not running:** `net start MongoDB`

**Port in use:** 
```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

---

## ✅ Verify It's Working

- Frontend: http://localhost:3000 (homepage loads)
- Backend: Terminal shows "Server running on port 5000"
- ML API: Terminal shows "Running on http://127.0.0.1:5001"

---

For detailed instructions, see [SETUP_GUIDE.md](SETUP_GUIDE.md)
