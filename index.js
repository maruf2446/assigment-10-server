const express = require('express')
const app = express()
require('dotenv').config();
const port = process.env.PORT || 5000;

var cors = require('cors')
const chefs = require('./Data/Chefs.json');
app.use(cors())


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5g4cvzm.mongodb.net/?retryWrites=true&w=majority`;

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

    const chifeCollection = client.db("ChefDB").collection("chefs");
    
    app.get('/chefs', async(req, res) =>{
        const result = await chifeCollection.find().toArray();
        res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('chefs is runing') 

})

app.get('/chefs', (req, res) => {
    res.send(chefs)
})

app.get('/chef/:id', (req, res) => {
    const id = req.params.id;
    const singlesData = chefs.find(chef => chef.id === id)
    res.send(singlesData)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

