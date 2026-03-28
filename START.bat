@echo off
Title Caramel Career Coffee - Server Startup
echo.
echo  ==========================================
echo   Caramel Career Coffee - Starting Servers
echo  ==========================================
echo.

:: Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js not found. Please install Node.js from https://nodejs.org
    echo Download the LTS version and run this script again.
    pause
    exit /b 1
)

echo [1/4] Node.js found: 
node --version

:: Install backend deps
echo.
echo [2/4] Installing backend dependencies...
cd /d "%~dp0backend"
if not exist node_modules (
    call npm install
)

:: Install frontend deps
echo.
echo [3/4] Installing frontend dependencies...
cd /d "%~dp0frontend"
if not exist node_modules (
    call npm install
)

:: Start both servers
echo.
echo [4/4] Starting servers...
echo.
echo  Backend API  -> http://localhost:5000
echo  Frontend App -> http://localhost:5173
echo.
echo  Default Admin Login:
echo    User ID  : admin
echo    Password : Admin@123
echo.

start "Caramel Career Coffee - Backend" cmd /k "cd /d %~dp0backend && node server.js"
timeout /t 3 /nobreak >nul
start "Caramel Career Coffee - Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"
timeout /t 3 /nobreak >nul

echo  Both servers started! Opening browser...
start http://localhost:5173
echo.
pause
