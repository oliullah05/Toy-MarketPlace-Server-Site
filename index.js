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
        return 
      }
    });

    const allToysData = client.db("Car-Toy").collection("Car-Toy-Data");

;

// Create a new index
const indexKeys = { toy_name: 1 };
const indexOptions = { name: "ToyNameIndex" };
const result =  allToysData.createIndex(indexKeys, indexOptions);




app.get("/search/:toyName", async (req, res) => {
  const toyName = req.params.toyName;
  console.log(toyName);
  const result = await allToysData
    .find({ toy_name: { $regex: toyName, $options: "i" } })
    .toArray();
  res.send(result);
});



    app.get("/alltoys", async (req, res) => {
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





      const alldata = await allToysData.find().limit(20).toArray();

      return res.send(alldata)
    })



    app.get("/alltoys/:email", async (req, res) => {
  const email = req.params.email;
  const emailfilter = { user_email: email };
  const options = {};
  const emaildata = await allToysData
    .find(emailfilter, options)
    .toArray();

  const sortedData = emaildata.sort((a, b) => {
    const priceA = parseInt(a.price);
    const priceB = parseInt(b.price);
    return priceA - priceB;
  });

  res.send(sortedData);
});






    app.get("/singletoy/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(object);
      const filterById = { _id: new ObjectId(id) };
      const singleData = await allToysData.findOne(filterById)
      res.send(singleData)
    })
  
 app.get("/category/:name",async(req,res)=>{
  const  category = req.params.name;
  // console.log(" category", category);
  const  categoryfilter = {category:  category }
  const options = {}
  //  console.log( category ,filter);
  // const categoryFilter = {category:req.params. category}
  const  categorydata = await allToysData.find( categoryfilter, options).toArray()
  res.send( categorydata)
 })




    app.post("/alltoys", async (req, res) => {
      const newPost = req.body;
      const result = await allToysData.insertOne(newPost);
      res.send(result)
    })


    app.put("/singletoy/:id", async (req, res) => {
      const id = req.params.id;
      const updatingData = req.body;
      console.log(id);
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true }
      // _id,toy_name,toy_img,price,category,quantity,rating,review,description,user_name,user_email,user_img
      const updateData = {
        $set: {
          toy_name: req.body.toy_name,
          toy_img: req.body.toy_img,
          price: req.body.price,
          category: req.body.category,
          rating: req.body.rating,
          description: req.body.description,
          quantity: req.body.quantity,
        },
      };
      const result = await allToysData.updateOne(filter, updateData, options);
      res.send(result)
    })


    app.delete("/alltoys/:id", async (req, res) => {
      const id = req.params.id;
      const find = { _id: new ObjectId(id) };
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