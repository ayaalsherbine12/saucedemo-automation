@echo off
setlocal
set "REPORT_DIR=%~dp0"
if "%REPORT_DIR:~-1%"=="\" set "REPORT_DIR=%REPORT_DIR:~0,-1%"
for %%I in ("%~dp0..") do set "PROJECT=%%~fI"
set "ALLURE_REPORT_DIR=%REPORT_DIR%"
set "ALLURE_SHARE_HOST=127.0.0.1"
set "ALLURE_SHARE_PORT=8765"
set "ALLURE_OPEN_BROWSER=1"
echo Starting Allure at http://127.0.0.1:8765/ ^(do not open index.html as a file^)
cd /d "%PROJECT%"
node scripts\serve-allure-report.mjs