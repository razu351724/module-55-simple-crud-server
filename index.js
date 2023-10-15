const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
const app =  express();
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json())

//razu351724
//VrRSx2VwQuy9UYv8


// const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://razu351724:VrRSx2VwQuy9UYv8@cluster0.q1yeyxk.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // এটা আমরা node mongodb crud থেকে নিছি 12, 13 লাইন
    // usage examples> Insert Operations> Insert a Document
    // const database = client.db("usersDB");
    // const userCollection = database.collection("users");
    //userCollection একবারেও করা য়ায়।
    const userCollection = client.db('userDB').collection('users');

    app.get('/users', async(req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    // আমরা এখানে client sida Update component ব্যবহারের জন্য কাজ করছি
    app.get('/users/:id', async(req,res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const user = await userCollection.findOne(query);
      res.send(user);
    })


    app.post('/users', async(req,res) => {
      const user = req.body;
      console.log('new user', user)
 // এটা আমরা node mongodb crud থেকে নিছি ২১ লাইন
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    app.put('/users/:id', async(req, res) => {
      const id = req.params.id;
      const user = req.body;
      console.log(id, user);
      const filter = {_id: new ObjectId(id)}
      const option = {upsert: true}
      const updatedUser = {
        $set: {
          name: user.name,
          email: user.email
        }
      }
      const result = await userCollection.updateOne(filter, updatedUser,option)
      res.send(result);
    })

    app.delete('/users/:id', async(req, res) => {
      const id = req.params.id
      console.log('Please dalete from database', id);
      const query = {_id: new ObjectId(id)}
      const result = await userCollection.deleteOne(query);
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req,res) => {
    res.send('SIMPLE CRUD IS RUNNING')
})

app.listen(port, () =>{
    console.log(`SIMPLE CRUD is running on port, ${port}`)
})