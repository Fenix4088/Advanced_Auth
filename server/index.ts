import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import fileupload from 'express-fileupload';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import router from './src/routers/user.router';

dotenv.config();

const PORT: number = (process.env.PORT && +process.env.PORT) || 5000;
const DB: string = `mongodb+srv://fenix:${process.env.PASS}@cluster0.yl9nm.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();
app.use(express.static('static'));
app.use(express.json());
app.use(cookieParser());
app.use(fileupload({}));
app.use(cors());

app.use('/api', router);

const startApp = async () => {
  try {
    mongoose.connect(`${DB}`, (err) => {
      if (err) throw new Error(err.message);

      console.log('Conected to db');
    });

    app.listen(PORT, () => {
      console.log(`App started on PORT: ${PORT}`);
    });
  } catch (err) {
    console.error(err);
  }
};

startApp();
