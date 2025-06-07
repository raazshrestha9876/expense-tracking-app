import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import errorMiddleware from './middleware/errorMiddleware.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config();

const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('uploads', express.static('uploads'))
app.use(cookieParser());

connectDB();

app.use(errorMiddleware);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})