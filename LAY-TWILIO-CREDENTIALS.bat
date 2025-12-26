@echo off
echo ============================================
echo   Lay Twilio STUN/TURN Credentials
echo ============================================
echo.
echo Buoc 1: Lay Account SID va Auth Token tu Twilio Console Dashboard
echo Buoc 2: Nhap thong tin ben duoi
echo.
set /p ACCOUNT_SID="Nhap Account SID: "
set /p AUTH_TOKEN="Nhap Auth Token: "
echo.
echo Dang lay credentials...
echo.

cd server
set TWILIO_ACCOUNT_SID=%ACCOUNT_SID%
set TWILIO_AUTH_TOKEN=%AUTH_TOKEN%
node get-twilio-turn-credentials.js

cd ..
pause

