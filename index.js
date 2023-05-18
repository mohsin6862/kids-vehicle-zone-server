const express = require('express');
const cors = require('cors');
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000;

// middleware

app.use(cors());
app.use(express.json())


app.get('/', (req,res)=>{
    res.send('Toy shop is running')
})

app.listen(port,()=>{
    console.log(`toy shop server is running on port ${port}`)
})
