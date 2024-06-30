import 'dotenv/config';
import { Db, MongoClient, Collection } from 'mongodb';
import User, { IUser } from '~/models/schemas/user.schema';

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_SERVERNAME}.sqz2qdy.mongodb.net/?appName=MinhEduServer`;

class DatabaseService {
    private static instance: DatabaseService;
    private client: MongoClient;
    private database: Db;

    private constructor() {
        this.client = new MongoClient(uri);
        this.database = this.client.db(process.env.DB_NAME);
    }

    public static getInstance(): DatabaseService {
        if (!DatabaseService.instance) {
            DatabaseService.instance = new DatabaseService();
        }
        return DatabaseService.instance;
    }

    async connect() {
        try {
            // Connect to the client
            await this.client.connect();
            // Send a ping to confirm a successful connection
            await this.database.command({ ping: 1 });
            console.log('Pinged your deployment. You successfully connected to MongoDB!');
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
        } finally {
            // await this.client.close();
        }
    }

    get users(): Collection<IUser> {
        if (!process.env.DB_USER_COLLECTION) {
            throw new Error('DOCUMENT_USER environment variable is not set or is empty');
        }
        return this.database.collection(process.env.DB_USER_COLLECTION);
    }
}

const databaseService = DatabaseService.getInstance();

export default databaseService;
