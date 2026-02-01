import Sale from "../models/Sale.js";
import Item from "../models/Item.js";
import existsById from "./helpers/idExists.js"




export async function getOrCreateCart(req,res){
    try{
        const sale = await Sale.findOne({status:"open",createdBy:req.user.id});

        if(!sale){
            const sale = await createSale(req.user.id)
            return res.status(201).json(sale)
        }

        return res.status(200).json(sale)
    }catch(error){
        console.error("Error creating Sale",error)
        res.status(500).json({message:"Internal server error"})
    }
}

export const createSale = async (id)=>{
    
    const saleBody = {
        status:"open",
        createdBy:id,// de parte del token
        items:[]
    }
    return  await Sale.create(saleBody);

     
}

export const addItemToCart = async(req,res)=>{
    
    const {saleId,sku} = req.params
    // falta el body de este post
    try {

        if (!(await existsById(Sale, saleId))) {
            return res.status(404).json({ message: "SaleId no encontrada" })
        }
        
        const item = await Item.findOne({sku})

        if(item){
            
            const alreadyIn = await Sale.findOne({_id: saleId,"items.itemId":item._id})

            if(alreadyIn){
                await updatedQuantityHelper(saleId,item._id,1)// si ya estaba en la venta agrego uno
                return res.status(200).json({ message: "Item en Carro Actualizado" })
            }
            else{
                // 
                const newItem = {
                    itemId: item._id,
                    sku:sku,
                    nameSnapshot: item.name,
                    prices:{
                        regular: item.price,
                        ppu: item.ppu ?? null,
                        ppm: item.ppm ?? null
                    },
                    pricingMode:"regular",
                    priceAtSale: item.price,
                    quantity: 1
                }
                await Sale.findByIdAndUpdate(
                    saleId,
                    {
                        $push: {
                            items: newItem
                        }
                    }
                )
                return res.status(201).json(newItem)
            }
        }
        else{
            console.log("no hay item")
            // quizá con esto meto un modal donde agregar el item recien scaneado que no estaba en el sistema
            return res.status(404).json({ message: "Item no encontrado" })
        }

        //res.status(200).json({ ok: true })
    } catch (error) {
        console.log("algo?",error)
        console.error("Error Inserting Item",error)
        res.status(500).json({message:"Internal server error"})
    }
}

export const updateItemQuantity = async(req,res)=>{

    const {saleId,itemId} = req.params;
    const {delta,newQuantity} = req.body;
    try{
        await updatedQuantityHelper(saleId,itemId,delta,newQuantity)
        res.status(200).json({message:"Cantidad actualizada"})
    }catch(error){
        console.error("Error updating quantity",error)
        res.status(500).json({message:"Internal server error"})
    }
}

async function updatedQuantityHelper(saleId,itemId,delta,newQuantity){
    if(delta!=null){
        // se cambio la cantidad con botones
        if( delta > 0){
               const updatedItem = await Sale.updateOne(
                   { _id: saleId, "items.itemId": itemId },
                   { $inc: { "items.$.quantity": delta } }
               )// usar $set acaba trayendo un valor viendo del state y no se actualiza bien si cambia la cantidad repetidas veces
               
           }
           else{// al restar solo permitir que se haga la request en caso de que cantidad>0
                const updatedItem = await Sale.updateOne(
                   { _id: saleId, "items.itemId": itemId,"items.quantity": { $gt: 0 } },
                   { $inc: { "items.$.quantity": delta } }
               )
           }

    }
    else if(newQuantity!=null){
        // se metió un valor nuevo 
        const updatedItem = await Sale.updateOne(
            { _id: saleId, "items.itemId": itemId },
             { $set: { "items.$.quantity": newQuantity } }
        )
    }
}

export const deleteCartRow = async(req,res)=>{
    const {saleId,itemId} = req.params;
    
    try{
        const updatedCart= await Sale.updateOne(
            { _id: saleId },
            { $pull: { items: { itemId } } }
        )
        res.status(200).json(updatedCart)// devuelve algo como esto:
            // {acknowledged: true,
            // matchedCount: 1,
            // modifiedCount: 1
            // }

    }catch(error){
        console.error("Error updating quantity",error)
        res.status(500).json({message:"Internal server error"})
    }
}

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
        const {saleId} = req.params
        const {status,total,items} = req.body

        const allowedStatus = ["completed", "cancelled", "paid"]
        //console.log(items)

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                message: "Invalid sale status"
            })
        }

        const sale = await Sale.findByIdAndUpdate(
            saleId,
            { status,totalAmount:total,items},
            { new: true }
        )

        if (!sale) {
            return res.status(404).json({
                message: "Sale not found"
            })
        }

        await processSaleItems(items);//AQUI

        res.status(200).json({message:"Venta Procesada"})

   }catch(error){
        console.error("Error Processing Sale",error)
        res.status(500).json({message:"Internal server error"})
   }
}

const processSaleItems= async(saleItems)=>{
    // revisa los items uno por uno y corrige stock

    for(const saleItem of saleItems){
        // hacer cosas
        const item = await Item.findOne({_id:saleItem.itemId})
        if(!item)
        {
            console.log("mal id ? ")// ver si llega como string y no objectID
            continue
        }

        let delta = 1
        if(saleItem.pricingMode === "regular") delta = item?.content ? item.content * saleItem.quantity :1
        if(saleItem.pricingMode === "ppm" || saleItem.pricingMode === "ppu") delta = saleItem.quantity 
        // si es ppm o ppu deberia restarse solo la cantidad que el usuario ingresó. es cuando es regular que necesito saber cuanto contenido tenia la <caja> para saber cuanto descontar del inventario
       
       
        

        await Item.findByIdAndUpdate(
        item._id,
        [
            {
            $set: {
                stock: {
                $max: [
                    0,
                    { $subtract: ["$stock", delta] }
                ]
                }
            }
            }
        ],
        { updatePipeline: true }
        )

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