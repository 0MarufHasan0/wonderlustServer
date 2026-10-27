import express from 'express'
import { MongoClient, ObjectId } from 'mongodb';
import 'dotenv/config'
import cors from 'cors'
const app = express()
const port = 8000

// Adds headers: Access-Control-Allow-Origin: *
 app.use(express.json())
app.use(cors())

// http://localhost:8000/add-destination


const client = new MongoClient(process.env.MONGODB_URI);
export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

 const mongoClient = await connectToMongoDB()

//  DataBase create and collection create
 const db = mongoClient.db('wonderlastt')
 const destinationCollection = db.collection('destination')

// fornted theke data collect

app.post('/add-destination', async(req , res)=>{
//    data khuja ba req body theke
    const data = req.body
    const result = await destinationCollection.insertOne(data)
    // console.log(data)
    console.log(result)
    res.send(result)
    // res.send({message:"'api working'"})
})

// Database theke nia asa

app.get('/destinations', async (req, res) => {
  const result = await destinationCollection.find().toArray();
  res.send(result);
});

// Details Data get one by one with id 

app.get('/destinations/:id', async (req, res) => {
  const { id } = req.params;

  const result = await destinationCollection.findOne({
    _id: new ObjectId(id)
  });

  res.send(result);
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// Edit

app.patch('/destinations/:id', async(req,res)=>{

  const {id}= req.params
  const updatedData = req.body
  const result = await destinationCollection.updateOne(
    {
    _id: new ObjectId(id)
  },
  {$set:updatedData}

)


res.json(result)


})

app.delete('/destinations/:id', async(req,res)=>{
  const {id} = req.params
  const result = await destinationCollection.deleteOne({
     _id: new ObjectId(id)
  })
  res.json(result)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})




