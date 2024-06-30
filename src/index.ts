import express, { Request, Response } from 'express';
import userRouters from './routes/user.routes';

const app = express();
const port = 3000;

app.use(express.json());

app.use('/api', userRouters);

app.listen(port, () => {
    console.log(`App running on port ${port}`);
});
