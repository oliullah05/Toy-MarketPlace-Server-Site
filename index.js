const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

// console.log(process.env.S3_BUCKET);

// uri on template string
const uri = `mongodb+srv://${process.env.S3_BUCKET}:${process.env.SECRET_KEY}@cluster0.iono61s.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
});

async function run() {
  try {
    // Connect  the client to the server	(optional starting in v4.7)
    client.connect((error) => {
      if (error) {
        console.log(error);
        return;
      }
    });

    const allToysData = client.db("Car-Toy").collection("Car-Toy-Data");
    

app.get("/alltoys",async(req,res)=>{
  // const email = req.params.email;
  // console.log("email",email);
  //    const emailfilter = {user_email:email}
    //  console.log(email ,filter);
// const categoryFilter = {category:req.params.email}
// const options = {}
// const emailquery = await allToysData.findOne(filter)
// res.send(email)
 
    //  if(req.params){
    //   console.log("email")
    //   const alldata =await allToysData.find(emailfilter,options).toArray();   
    //   return res.send(alldata)
    //  }

  

 

    const alldata =await allToysData.find().limit(20).toArray();
    
    return res.send(alldata)
})

app.get("/alltoys/:email",async(req,res)=>{
    const email = req.params.email;
  // console.log("email",email);
     const emailfilter = {user_email:email}
     const options = {}
    //  console.log(email ,filter);
// const categoryFilter = {category:req.params.email}
const emaildata = await allToysData.find(emailfilter,options).toArray()
res.send(emaildata)
})

app.get("/singletoy/:id",async(req,res)=>{
  const id = req.params.id;
  // console.log(object);
    const filterById = { _id : new ObjectId(id)};
    const singleData = await allToysData.findOne(filterById)
    res.send(singleData)
})






app.post("/alltoys",async(req,res)=>{
const newPost = req.body ;
const result = await allToysData.insertOne(newPost);
res.send(result)
})


app.put("/alltoys/:id",async(req,res)=>{
  const id = req.params.id;
  const updatingData = req.body;
  const filter = { _id : new ObjectId(id)};
  const options = { upsert: true }

  const updateData = {
    $set: {
      name:req.body.name,
      email:req.body.email,
      img:req.body.img,
      category:req.body.category,
    },
  };
  const result = await allChokolates.updateOne(filter, updateData, options);
  res.send(result)
})


app.delete("/alltoys/:id",async(req,res)=>{
  const id = req.params.id;
  const find = {_id:new ObjectId(id)};
  const data = await allToysData.deleteOne(find)
  res.send(data)
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



app.get("/", (req, res) => {
  res.send("Assignment 11 in running");
});

app.listen(port, () => {
  console.log(`Assignment 11  server on port ${port}`);
});