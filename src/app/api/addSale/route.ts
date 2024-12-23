import { MongoClient } from 'mongodb';
 
export async function POST(request: Request) {
  const uri = process.env.MONGODB_URI ? process.env.MONGODB_URI : ""
  const client = new MongoClient(uri)
  let result = await request.json()
  try {
    await client.connect()
    const database = client.db("bukku")
    const sale = database.collection("sale")
    const purchase = database.collection("purchase")
    const inventory = database.collection("inventory")

    // Add transaction_id as a field and auto-generate id
    const documentBody = {
      date: result.date,
      quantity: result.quantity,
      price: result.price,
      totalAmount: result.totalAmount,
      totalCost: result.totalCost
    }
    
    // Check if there's already a document with the same date. Only one transaction is alowed per day
    const purchaseDoc = await purchase.findOne({"date": result.date})
    const saleDoc = await sale.findOne({"date": result.date})
    if (purchaseDoc || saleDoc){
      return Response.json({status: 400, message: "Transaction already made today"})
    }else{
      const res = await sale.insertOne(documentBody)
      await inventory.findOneAndUpdate({},{
        $inc: { totalGoods: -result.quantity, totalValue: -Number((result.totalCost).toFixed(2)) },
      })
      return Response.json(res);
    }
  }catch(error){
    return Response.json({status: 500, message: error})
  }

}

export async function GET(request: Request) {
  const uri = process.env.MONGODB_URI ? process.env.MONGODB_URI : ""
  const client = new MongoClient(uri)
  try {
    await client.connect()
    const db = client.db("bukku")
    
    const sale = db.collection("sale")
    const data = await sale.find({}).toArray();
    console.log(data)
    return Response.json({data})
  }catch(err){
    return Response.json({status: 500, message: "ha?"})
  }
}


