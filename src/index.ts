import express, { Request, Response } from 'express';
import 'dotenv/config';
import userRouters from './routes/user.routes';
import database from './services/database.services';

const app = express();

app.use(express.json());

app.use('/api', userRouters);

database.connect();

app.listen(process.env.SERVER_PORT, () => {
    console.log(`App running on port ${process.env.SERVER_PORT}`);
});
