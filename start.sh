#!/bin/bash

# Use local node if available
export PATH="$PWD/node-v20.10.0-darwin-x64/bin:$PATH"

echo "🚀 Starting Surfari..."

# Function to kill background processes on exit
cleanup() {
    echo "🛑 Shutting down..."
    kill $BACKEND_PID
    kill $FRONTEND_PID
    exit
}

trap cleanup SIGINT

echo "🔌 Starting Backend (Port 3000)..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to initialize
sleep 2

echo "💻 Starting Frontend (Port 5173)..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo "✨ App is running!"
echo "👉 Frontend: http://localhost:5173"
echo "👉 Backend:  http://localhost:3000"
echo "Press CTRL+C to stop."

wait $BACKEND_PID $FRONTEND_PID
