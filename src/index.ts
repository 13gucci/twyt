import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import userRouters from '~/routes/user.routes';
import database from '~/services/database.services';
import STATUS_CODES from './constants/httpStatusCode';

const app = express();

app.use(express.json());

app.use('/api/user', userRouters);

database.connect();

// Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.log('Xy ly o index', err);
    res.status(STATUS_CODES.NOT_FOUND).json({
        error: err.message
    });
});

app.listen(process.env.SERVER_PORT, () => {
    console.log(`App running on port ${process.env.SERVER_PORT}`);
});
