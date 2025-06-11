import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { json, urlencoded } from 'express';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import departmentRoutes from './routes/department.routes';
import shiftRoutes from './routes/shift.routes';
import shiftRequestRoutes from './routes/shiftRequest.routes';
import config from './config/index';

const app = express();

// Middleware
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use('/api/auth', authRoutes);

// Database connection
const mongoUri = `mongodb://${config.db.user}:${config.db.password}@${config.db.host}:${config.db.port}/${config.db.database}`;
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/shifts', shiftRoutes);
app.use('/api/shift-requests', shiftRequestRoutes);

// Start the server
const PORT = config.port || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});