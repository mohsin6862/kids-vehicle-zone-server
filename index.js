const express = require('express');
const cors = require('cors');
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000;

// middleware

app.use(cors());
app.use(express.json())



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER_ID}:${process.env.USER_PASS}@mohsin.hrlaneq.mongodb.net/?retryWrites=true&w=majority`;

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

    const carsCollection = client.db("kidsVehicleZoneDB").collection("carsDB")
    const truckCollection = client.db("kidsVehicleZoneDB").collection("truckDB")
    const collectorsCollection = client.db("kidsVehicleZoneDB").collection("collectorsDB")
    const allVehiclesCollection = client.db("kidsVehicleZoneDB").collection("allVehiclesDB")
    const featuredCollection = client.db("kidsVehicleZoneDB").collection("featuredDB")
    const addVehiclesCollection = client.db("kidsVehicleZoneDB").collection("addVehiclesDB")
    app.get('/cars',async(req,res)=>{

        const cursor = carsCollection.find()
        const result = await cursor.toArray()
        res.send(result)
    })
    app.get('/truck',async(req,res)=>{

        const cursor = truckCollection.find()
        const result = await cursor.toArray()
        res.send(result)
    })
    app.get('/collectors',async(req,res)=>{

        const cursor = collectorsCollection.find()
        const result = await cursor.toArray()
        res.send(result)
    })
    app.get('/featured',async(req,res)=>{

        const cursor = featuredCollection.find()
        const result = await cursor.toArray()
        res.send(result)
    })

    app.get('/allvehicles', async(req,res)=>{
        const cursor = allVehiclesCollection.find()
        const result = await cursor.toArray()
        res.send(result)
    })

    app.get('/allvehicles/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id : new ObjectId(id)}
        const result= await allVehiclesCollection.findOne(query)
        res.send(result)
    })

    app.get('/addvehicle', async(req,res)=>{
        const cursor = addVehiclesCollection.find()
        const result = await cursor.toArray()
        res.send(result)
    })
    app.get('/addveicle/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)} 
        const result = await addVehiclesCollection.findOne(query)
        res.send(result)
    })


    app.post('/addvehicle', async(req,res)=>{
        const newVehicle = req.body
        console.log(newVehicle)
        const result = await addVehiclesCollection.insertOne(newVehicle);
        res.send(result)
    })

    app.delete('/addveicle/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)} 
        const result = await addVehiclesCollection.deleteOne(query)
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




app.get('/', (req,res)=>{
    res.send('Toy shop is running')
})



app.listen(port,()=>{
    console.log(`toy shop server is running on port ${port}`)
})
