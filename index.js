const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// user: smabari
// pass: MxTKpLICVPAtYa0Q
const uri =
  "mongodb+srv://smabari:MxTKpLICVPAtYa0Q@cluster0.bsqinhw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const usersCollection = client.db("usersdb").collection("users");

    app.get("/users", async (request, response) => {
      const cursor = usersCollection.find();
      const result = await cursor.toArray();
      response.send(result);
    });

    app.post("/users", async (request, response) => {
      console.log("data in the server", request.body);
      const newUser = request.body;
      const result = await usersCollection.insertOne(newUser);
      response.send(result);
    });

    app.delete("/users/:id", async (req, res) => {
      // console.log(req.params);
      const id = req.params.id;
      // console.log("to be deleted", id);
      const query = { _id: new ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (request, response) => {
  response.send("crud running");
});

app.listen(port, () => {
  console.log(`crud server running in ${port}`);
});
