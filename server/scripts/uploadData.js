require("dotenv").config();
const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI;

async function uploadData(collectionName, data) {
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    try {
        await client.connect();
        console.log("Connected to MongoDB");

        const db = client.db("ietos");
        const collection = db.collection(collectionName);

        const result = await collection.insertMany(data);
        console.log(`${result.insertedCount} documents inserted`);
    }
    catch (error) {
        console.error("Error uploading data: ", error);
    }
    finally {
        await client.close();
        console.log("Connection closed");
    }
}