import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRoute.js';
import doctorRouter from './routes/doctorRoute.js';
import userRouter from './routes/userRoute.js';




//app config

const app = express();
const port = process.env.PORT || 4000;

// Validate required environment variables
if (!process.env.JWT_SECRET) {
  console.error('❌ JWT_SECRET is not set in environment variables!');
  console.error('⚠️  Please set JWT_SECRET in your .env file');
  console.error('   Example: JWT_SECRET=your_very_secure_secret_key_here');
  process.exit(1);
}

//middlewares

app.use(express.json());

// Configure CORS to allow all origins (for deployment)
app.use(cors({
    origin: '*', // Allow all origins - change this to specific domains in production if needed
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'token', 'atoken', 'dtoken'],
    credentials: true
}));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'Backend is running',
        timestamp: new Date().toISOString()
    });
});

connectDB();
connectCloudinary();


//api endpoints
app.use('/api/admin', adminRouter);
app.use('/api/doctors', doctorRouter);
app.use('/api/users', userRouter);


app.get('/', (req, res) => {
    res.send('api working ');
})


app.listen(port, () => {
    console.log(`app listening on port ${port}`);
})  