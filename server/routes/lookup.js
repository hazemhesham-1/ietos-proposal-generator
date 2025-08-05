const path = require("path");
const fs = require("fs");
const express = require("express");
const router = express.Router();
require("dotenv").config();

const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI;

router.get("/governorates", async (req, res) => {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db("ietos");
        const collection = db.collection("governorates");

        const governorates = await collection.find().sort({ name_en: 1 }).toArray();
        res.json(governorates);
    }
    catch(err) {
        res.status(500).json({ error: "Server error" });
    }
    finally {
        await client.close();
    }
});

router.get("/treatment-types", async (req, res) => {
    try {
        const dataPath = path.join(__dirname, "../data", "treatments.json");
        const jsonData = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

        res.json(jsonData.types);
    }
    catch(err) {
        res.status(500).json({ error: "Server error" });
    }
});

router.get("/currencies", async (req, res) => {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db("ietos");
        const collection = db.collection("currencies");

        const currencies = await collection.find().sort({ name_en: 1 }).toArray();
        res.json(currencies);
    }
    catch(err) {
        res.status(500).json({ error: "Server error" });
    }
    finally {
        await client.close();
    }
});

router.get("/operations", async (req, res) => {
    try {
        const dataPath = path.join(__dirname, "../data", "operations.json");
        const jsonData = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

        res.json(jsonData);
    }
    catch(err) {
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;