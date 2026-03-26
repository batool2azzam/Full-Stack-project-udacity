import express from 'express';
import { imagesRouter } from './routes/images';

export const app = express();

app.use(express.json());
app.use('/api', imagesRouter);

