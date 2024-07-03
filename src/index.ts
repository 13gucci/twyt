import 'dotenv/config';
import express from 'express';
import userRouters from '~/routes/user.routes';
import database from '~/services/database.services';
import { errorHandler } from './middlewares/error.middlewares';

const app = express();

app.use(express.json());

app.use('/api/user', userRouters);

database.connect();

// Error Handler
app.use(errorHandler);

app.listen(process.env.SERVER_PORT, () => {
    console.log(`App running on port ${process.env.SERVER_PORT}`);
});
