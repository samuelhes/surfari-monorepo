import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

import authRoutes from './routes/authRoutes';
import rideRoutes from './routes/rideRoutes';
import requestRoutes from './routes/requestRoutes';
import paymentRoutes from './routes/paymentRoutes';
import userRoutes from './routes/userRoutes';

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/rides', rideRoutes);
app.use('/rides/:rideId/requests', requestRoutes);
app.use('/payments', paymentRoutes);
app.use('/users', userRoutes);

// Serve static files from the 'public' directory (Frontend build)
// In Docker, we copy frontend/dist to /app/public
// Locally, we might want to point to ../frontend/dist if running built version
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

// Catch-all route to serve index.html for client-side routing
app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
