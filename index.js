const express = require('express');
const cors = require('cors');
const app = express()
require('dotenv').config()
const jwt = require('jsonwebtoken')
const port = process.env.PORT || 5000;

// middleware

const corsOptions ={
  origin:'*', 
  credentials:true,
  optionSuccessStatus:200,
}

app.use(cors(corsOptions))
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
    // await client.connect();

    const carsCollection = client.db("kidsVehicleZoneDB").collection("carsDB")
    const truckCollection = client.db("kidsVehicleZoneDB").collection("truckDB")
    const collectorsCollection = client.db("kidsVehicleZoneDB").collection("collectorsDB")
    const allVehiclesCollection = client.db("kidsVehicleZoneDB").collection("allVehiclesDB")
    const featuredCollection = client.db("kidsVehicleZoneDB").collection("featuredDB")
    const addVehiclesCollection = client.db("kidsVehicleZoneDB").collection("addVehiclesDB")
    const hotDealsCollection = client.db("kidsVehicleZoneDB").collection("hotDealsDB")

    app.post('/jwt',(req,res)=>{
        const user = req.body;
        console.log(user);
        const token = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn: '1h'})
        res.send({token})
    })

    


    app.get('/hotdeals',async(req,res)=>{

        const cursor = hotDealsCollection.find()
        const result = await cursor.toArray()
        res.send(result)
    })
    app.get('/cars',async(req,res)=>{

        const cursor = carsCollection.find()
        const result = await cursor.toArray()
        res.send(result)
    })
    app.get('/cars/:id',async(req,res)=>{
      const id = req.params.id;
      const query= {_id: new ObjectId(id)}
      const result = await carsCollection.findOne(query)
      res.send(result)

    })
    app.get('/truck',async(req,res)=>{

        const cursor = truckCollection.find()
        const result = await cursor.toArray()
        res.send(result)
    })
    app.get('/truck/:id',async(req,res)=>{
      const id = req.params.id;
      const query= {_id: new ObjectId(id)}
      const result = await truckCollection.findOne(query)
      res.send(result)

    })
    app.get('/collectors',async(req,res)=>{

        const cursor = collectorsCollection.find()
        const result = await cursor.toArray()
        res.send(result)
    })
    app.get('/collectors/:id',async(req,res)=>{
      const id = req.params.id;
      const query= {_id: new ObjectId(id)}
      const result = await collectorsCollection.findOne(query)
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
 


    // add toys 
    
    // app.get('/addvehicle', async(req,res)=>{
    //     const cursor = addVehiclesCollection.find()
    //     const result = await cursor.toArray()
    //     res.send(result)
    // })


    app.get('/addvehicle/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id : new ObjectId(id)}
        const result= await addVehiclesCollection.findOne(query)
        res.send(result)
    })


    app.get('/addvehicle', async(req,res)=>{
        console.log(req.query.email)
        let query={}
        if(req.query?.email){
            query= {email:req.query.email}
        }
        const result = await addVehiclesCollection.find(query).toArray();
        res.send(result)
    })

 

    app.post('/addvehicle', async(req,res)=>{
        const newVehicle = req.body
        console.log(newVehicle)
        const result = await addVehiclesCollection.insertOne(newVehicle);
        res.send(result)
    })

    app.put('/addvehicle/:id',async(req,res)=>{
        const id = req.params.id;
        const filter ={_id : new ObjectId(id)}
        const options = { upsert: true };
        const updatedVehicle = req.body
        const vehicle ={
          $set: {
            name : updatedVehicle.name , 
            title:  updatedVehicle.title, 
            description :  updatedVehicle.description, 
            price:updatedVehicle.price, 
            ratings: updatedVehicle.ratings, 
            stock :updatedVehicle.stock, 
            photo: updatedVehicle.photo
          }
        }
        const result = await addVehiclesCollection.updateOne(filter,vehicle,options);
        res.send(result)
  
      })

    app.delete('/addveicle/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)} 
        const result = await addVehiclesCollection.deleteOne(query)
        res.send(result)
    })

    app.get('/total-toys',async(req,res)=>{
      const result =await addVehiclesCollection.estimatedDocumentCount();
      res.send({totalVehicle:result})
    })


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
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
