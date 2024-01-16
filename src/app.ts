import express, { Application } from 'express';
// import mongoose from 'mongoose';
import router from './routes/index';

const { PORT = 3000 } = process.env;
const app: Application = express();

app.use(express.json());
app.use('/', router);

app.use((req: any, res, next) => {
  req.user = {
    _id: '644aa6b337ae86e426ed79a2',
  };

  next();
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});

/*
const start = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/test');
    app.listen(
      PORT,
      () => console.log(`Server started on port ${PORT}`),
    );
  } catch (error) {
    console.error(error);
  }
};

start();
*/
