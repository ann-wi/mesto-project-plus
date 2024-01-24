import express from 'express';
import { errors } from 'celebrate';
import mongoose from 'mongoose';
import userRouter from './routes/user';
import cardRouter from './routes/card';
import { errorLogger, requestLogger } from './middlewares/logger';
import { createUserValidation, loginValidation } from './validators/userValidator';
import { createUser, loginUser } from './controllers/user';
import {authMiddleware } from './middlewares/auth';
import errorHandler from './middlewares/errorHandler';

const helmet = require('helmet');

const { PORT = 3000, MESTO_DB = 'mongodb://localhost:27017/mestodb' } = process.env;
const app = express();
app.use(helmet());

app.use(express.json());

app.use(requestLogger);

app.post('/signup', createUserValidation, createUser);
app.post('/signin', loginValidation, loginUser);

app.use(authMiddleware);

app.use(userRouter);
app.use(cardRouter);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

async function startServer() {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(MESTO_DB);
    console.log('Database Mesto is connected');
    await app.listen(PORT);
    console.log(`Server started on port: ${PORT}`);
  } catch (err) {
    console.log('Server Error:', err);
  }
}

startServer();
