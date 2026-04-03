#!/bin/bash
echo "🚀 Starting MindCare..."
sudo service mysql start
sleep 2
fuser -k 5000/tcp 2>/dev/null
cd /workspaces/psychiatrist-bot/backend && node server.js > /tmp/backend.log 2>&1 &
echo "✅ Backend started!"
cd /workspaces/psychiatrist-bot && npm run dev
