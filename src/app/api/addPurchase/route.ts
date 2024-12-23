import { MongoClient } from 'mongodb';
 
export async function POST(request: Request) {
  const uri = process.env.MONGODB_URI ? process.env.MONGODB_URI : ""
  const client = new MongoClient(uri)
  let result = await request.json()
  try {
    await client.connect()
    const database = client.db("bukku")
    const inventory = database.collection("inventory")
    const transactions = database.collection("transactions")

    let documentBody = {}
    
    // Bodies have different fields based on transaction types
    if(result.transactionType == 'purchase'){
      documentBody = {
        date: result.date,
        quantity: result.quantity,
        price: result.price,
        totalValue: result.price * result.quantity,
        transactionType: result.transactionType
      }
    }else if(result.transactionType =='sale'){
      documentBody = {
        date: result.date,
        quantity: result.quantity,
        price: result.price,
        totalAmount: result.totalAmount,
        totalCost: result.totalCost,
        transactionType: result.transactionType
      }
    }
    
    
    // Check if there's already a document with the same date. Only one transaction is alowed per day
    const transactionDoc = await transactions.findOne({"date": result.date})
    if (transactionDoc){
      return Response.json({status: 400, message: "Transaction already made today"})
    }else{

      // Getting the most recent transaction to make sure transactions are made in chronological order
      const recentTransaction = await transactions.findOne({}, {
        sort: { "date" : -1 }
      })
      if( recentTransaction && (new Date(result.date) < new Date(recentTransaction.date))){
        return Response.json({status: 400, message: `New transactions needs to be made after ${recentTransaction.date}`})
      }

      // Inserting new transaction records
      const res = await transactions.insertOne(documentBody)

      // Updating Total Goods and Total Value 
      if (result.transactionType == 'purchase'){
        await inventory.findOneAndUpdate({},{
          $inc: { totalGoods: result.quantity, totalValue: Number((result.price * result.quantity).toFixed(2)) },
        })
      }else{
        await inventory.findOneAndUpdate({},{
          $inc: { totalGoods: -result.quantity, totalValue: -Number((result.totalCost).toFixed(2)) },
        })
      }
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
    const transactions = db.collection("transactions")

    // Separating purchase and sale transactions into 2 different arrays for ease of use
    const purchase = await transactions.find({"transactionType": "purchase"}).toArray();
    const sale = await transactions.find({"transactionType": "sale"}).toArray();
    
    return Response.json({"purchases" : purchase, "sales": sale})

  }catch(err){
    return Response.json({status: 500, message: "ha?"})
  }
}

