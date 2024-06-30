import express, { Request, Response } from 'express';
import userRouters from './routes/user.routes';
import database from './services/database.services';

const app = express();
const port = 3000;

app.use(express.json());

app.use('/api', userRouters);
database.connect();

app.listen(port, () => {
    console.log(`App running on port ${port}`);
});
