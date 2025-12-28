import Sale from "../models/Sale.js";
import Item from "../models/Item.js";


export async function getItemDetails(req,res){


    try {
    const {sku} = req.params
    const retrievedItem = await Item.findOne({sku})
    
    if (!retrievedItem) {
        //findOne puede dar null lo que no da error
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json(retrievedItem);
    } catch (error) {
        console.error("Error in getItemDetils",error)
        res.status(500).json({message:"Internal server error"})
    }
}

export const createSale = async (req,res)=>{
    try {
        const newSale = await Sale.create();

        res.status(200).json(200)
    } catch (error) {
        console.error("Error creating Sale",error)
        res.status(500).json({message:"Internal server error"})
    }
}

export const saveSale = async (req, res)=>{
    // put the sale on pause. call this everytime a relevant change to the current sale occurs
    const {saleId} = req.params
    try{
        const formatedItems = await formatItems(req.body)
        const saleDetail = {
            status: "open",
            updatedAt: new Date(),
            items: formatedItems
        }

        const updatedSale = await Sale.findByIdAndUpdate(saleId,saleDetail,{
            new:true,
            runValidators: true
        })
        
         if (!updatedSale) {
            return res.status(404).json({ message: "Sale not found" })
        }
        res.status(200).json(updatedSale)

   }catch(error){
        console.error("Error Processing Sale",error)
        res.status(500).json({message:"Internal server error"})
   }


}

export const processSale = async (req, res)=>{
    // call this if the state is " cancelled" or "paid". i should deleted from the local variables/ states in the front end as soon as i received the 200 state
   try{
        const items = req.body.items;
        const formatedItems = await formatItems(items)
        const saleDetail = {
            status: items.status,
            createdBy: "default",//luego lo cambio,
            items: formatedItems
    }

    const newSale = await Sale.create(saleDetail)
    
    res.status(200).json(newSale)

   }catch(error){
        console.error("Error Processing Sale",error)
        res.status(500).json({message:"Internal server error"})
   }
}


 async function formatItems(items){
    
    const formatedItems = []

    for(const item of items){
        // ID of the actual item in the DB
        const dbItem = await Item.findOne({sku:item.sku})

        if (!dbItem) {
            throw new Error(`Item with SKU ${item.sku} does not exist`);
        }

        formatedItems.push({
            itemId:dbItem._id,
            nameSnapshot: item.name,
            priceAtSale: item.price,    
            quantity: item.quantity
        })

    }

    return formatedItems
   
}