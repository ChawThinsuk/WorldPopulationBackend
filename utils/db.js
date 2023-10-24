const { MongoClient } = require("mongodb");

const connectionString = "mongodb+srv://chawbanthin:Chaw0882282083@cluster0.jrqix5y.mongodb.net/";

const client = new MongoClient(connectionString);

const db = client.db("population")

exports.client = client
exports.db = db