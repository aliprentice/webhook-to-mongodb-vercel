// Import MongoDB client
const { MongoClient } = require("mongodb");

// Cache the DB connection to reuse between function calls
let cachedDb = null;

// Function to connect to MongoDB
async function connectToDatabase(uri) {
  if (cachedDb) return cachedDb;
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const db = client.db("flights1"); // Change to your database name
  cachedDb = db;
  return db;
}

// Vercel API handler
module.exports = async (req, res) => {
  if (req.method === "POST") {
    try {
      // Get JSON data from the request
      const requestData = req.body;
      console.log("Incoming webhook data:", requestData);

      // Connect to MongoDB using the connection string stored in environment variables
      const db = await mongodb+srv://aprentice:<db_password>@cluster0.uarhn3a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0(process.env.MONGODB_URI);
      
      // Insert the received data into a collection (change 'myCollection' as needed)
      const result = await db.collection("myCollection").insertOne(requestData);

      // Respond with success
      res.status(200).json({
        message: "Data received and saved",
        insertedId: result.insertedId,
      });
    } catch (error) {
      console.error("Error in webhook function:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    // If method is not POST, return 405 Method Not Allowed
    res.status(405).json({ message: "Method not allowed" });
  }
};
