import express, { NextFunction, Response } from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/user';
import cardRouter from './routes/card';
import { TypeUser } from './types';

const helmet = require('helmet');

const { PORT = 3000, MESTO_DB = 'mongodb://localhost:27017/mestodb' } = process.env;
const app = express();
app.use(helmet());

app.use(express.json());

app.use((req: TypeUser, res: Response, next: NextFunction) => {
  req.user = {
    _id: '65a8ccdfd487083ed2671513',
  };
  next();
});

app.use(userRouter);
app.use(cardRouter);

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
