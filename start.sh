#!/bin/bash
echo "🚀 Starting MindCare..."

# Start MySQL
sudo mysqld --user=mysql --socket=/var/run/mysqld/mysqld.sock &
echo "⏳ Waiting for MySQL..."
sleep 5

# Start Backend
cd /workspaces/psychiatrist-bot/backend
node server.js &
echo "✅ Backend started!"
sleep 3

# Start Frontend
cd /workspaces/psychiatrist-bot
npm run dev
