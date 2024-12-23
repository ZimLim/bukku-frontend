import { MongoClient } from 'mongodb';
 
export async function POST(request: Request) {
  const uri = process.env.MONGODB_URI ? process.env.MONGODB_URI : ""
  const client = new MongoClient(uri)
  let result = await request.json()
  try {
    await client.connect()
    const database = client.db("bukku")
    const purchase = database.collection("purchase")
    const sale = database.collection("sale")
    const inventory = database.collection("inventory")
    const documentBody = {
      date: result.date,
      quantity: result.quantity,
      price: result.price,
      totalValue: result.price * result.quantity
    }
    
    
    // Check if there's already a document with the same date. Only one transaction is alowed per day
    const purchaseDoc = await purchase.findOne({"date": result.date})
    const saleDoc = await sale.findOne({"date": result.date})
    if (purchaseDoc || saleDoc){
      return Response.json({message: "Transaction already made today"})
    }else{
      const res = await purchase.insertOne(documentBody)
      await inventory.findOneAndUpdate({},{
        $inc: { totalGoods: result.quantity, totalValue: result.price * result.quantity },
      })
      return Response.json(res);
    }
  }catch(error){
    return Response.json({status: 500, message: error})
  }

}
