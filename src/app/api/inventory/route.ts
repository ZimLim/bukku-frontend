import { MongoClient } from 'mongodb';
 
export async function GET(request: Request) {
  const uri = process.env.MONGODB_URI ? process.env.MONGODB_URI : ""
  const client = new MongoClient(uri)
  
  try {
    await client.connect()
    const database = client.db("bukku")
    const collection = database.collection("inventory")
    
    const doc = await collection.findOne({})
    return Response.json(doc)
    // Check if there's already a document with the same date
    
  }catch(error){
    return Response.json({status: 500, message: error})
  }

}

