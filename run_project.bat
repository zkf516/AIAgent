REM 检查 Node.js 是否已安装
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo 未检测到 Node.js，请先从 https://nodejs.org/ 下载并安装 Node.js
    pause
    exit /b 1
)

REM 检查 npm 是否可用
npm -v >nul 2>&1
if %errorlevel% neq 0 (
    echo 未检测到 npm，请检查 Node.js 安装是否完整
    pause
    exit /b 1
)

REM 安装依赖
echo 正在安装依赖...
npm install

REM 启动前端服务
echo 正在启动前端服务...
start cmd /k npm run dev

REM 等待服务启动后自动打开浏览器（默认端口5173，可根据实际修改）
timeout /t 5
start http://localhost:5173

echo 启动完成，浏览器已自动打开。如未打开请手动访问 http://localhost:5173
pause