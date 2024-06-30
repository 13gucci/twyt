import 'dotenv/config';
import { Db, MongoClient } from 'mongodb';

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_SERVERNAME}.sqz2qdy.mongodb.net/?appName=MinhEduServer`;

class DatabaseService {
    private static instance: DatabaseService;
    private client: MongoClient;
    private database: Db;

    private constructor() {
        this.client = new MongoClient(uri);
        this.database = this.client.db('user');
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
        }
    }

    get users() {
        return this.database.collection('users');
    }
}

const databaseService = DatabaseService.getInstance();

export default databaseService;
