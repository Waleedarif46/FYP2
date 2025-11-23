@echo off
title SignVerse - Application Launcher
color 0A

echo ========================================
echo    SignVerse - Application Launcher
echo ========================================
echo.

:: Check if MongoDB is running
echo [1/4] Checking MongoDB...
sc query MongoDB | find "RUNNING" >nul
if %errorlevel% == 0 (
    echo       MongoDB is running [OK]
) else (
    echo       MongoDB is not running!
    echo       Starting MongoDB...
    net start MongoDB >nul 2>&1
    if %errorlevel% == 0 (
        echo       MongoDB started [OK]
    ) else (
        echo       Warning: Could not start MongoDB as service
        echo       You may need to start it manually: mongod
    )
)
echo.

:: Check if node_modules exists
echo [2/4] Checking dependencies...
if not exist "node_modules\" (
    echo       Root dependencies not found. Installing...
    call npm install
)
if not exist "client\node_modules\" (
    echo       Client dependencies not found. Installing...
    cd client
    call npm install
    cd ..
)
if not exist "server\node_modules\" (
    echo       Server dependencies not found. Installing...
    cd server
    call npm install
    cd ..
)
if not exist "ml_backend\venv\" (
    echo       Python virtual environment not found. Creating...
    cd ml_backend
    python -m venv venv
    call venv\Scripts\activate
    pip install -r requirements.txt
    call deactivate
    cd ..
)
echo       Dependencies checked [OK]
echo.

:: Start Backend + Frontend
echo [3/4] Starting Backend and Frontend...
start "SignVerse - Backend + Frontend" cmd /k "title SignVerse Backend + Frontend && npm run dev"
echo       Backend + Frontend starting... [OK]
timeout /t 3 /nobreak >nul
echo.

:: Start ML Backend
echo [4/4] Starting ML Backend...
start "SignVerse - ML Backend" cmd /k "title SignVerse ML Backend && cd ml_backend && venv\Scripts\activate && python app.py"
echo       ML Backend starting... [OK]
echo.

echo ========================================
echo    All Services Started Successfully!
echo ========================================
echo.
echo Application URLs:
echo   Frontend:  http://localhost:3000
echo   Backend:   http://localhost:5000
echo   ML API:    http://localhost:5001
echo.
echo Wait 10-15 seconds for all services to fully start,
echo then open http://localhost:3000 in your browser.
echo.
echo To stop: Close all opened terminal windows
echo          or press Ctrl+C in each window
echo.
timeout /t 5
start http://localhost:3000
echo.
echo Press any key to exit this launcher...
pause >nul

