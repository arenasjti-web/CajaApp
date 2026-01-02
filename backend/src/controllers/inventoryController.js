   import Item from "../models/Item.js";


    export const getInventory = async (req,res)=>{

        try{
            const filter = inventoryFilter(req.query)
            const items = await Item.find(filter);

            res.status(200).json(items)
        }
        catch(error){
            console.error("Error in getInventory ",error)
            res.status(500).json({message:"Internal server error"})
        }

    }

    function inventoryFilter({ category, minPrice, maxPrice, inStock, active }){

        const filter = {}

        if (category) {
        filter.category = category
        }

        if (active !== undefined) {
        filter.active = active === "true"
        }

        if (inStock === "true") {
        filter.stock = { $gt: 0 }
        }

        if (minPrice || maxPrice) {
        filter.price = {}

        if (minPrice) filter.price.$gte = Number(minPrice)
        if (maxPrice) filter.price.$lte = Number(maxPrice)
        }

        return filter;
    }

    export const addOneToInventory = async(req,res)=>{

        try {

            const validatedBody = validateItem(req.body)
            if(!validatedBody) return res.status(400).json({ message: "Invalid body" })
            const newItem = await Item.create(validatedBody) // opcion de mongoose
            //const newItem = await Item.insertOne(req.body);// driver nativo
            res.status(200).json(newItem);

        } catch (error) {
            console.error("Error in addOneToInventory ",error)
            res.status(500).json({message:"Internal server error"})
        }
    }

    function validateItem({sku,name,price,stock}){
        const validatedBody = {
            sku,
            name,
            price,
            stock
        }

        if( !sku || !name || price === undefined || stock=== undefined){
            return null//{} es truthy por lo que no servia 
        }

        if( price <0 || stock <0){
            return null//{} es truthy por lo que no servia 
        }

        return validatedBody

        
    }
    
    export const addManyToInventory = async(req,res)=>{
        // from CSV?. make it later as an extra feature
    }

    export const updateItem = async(req,res)=>{

        // cambiar para que lea con Sku
        const {sku} = req.params
        try {
            const validatedItem = validateItem(req.body)
            if(!validatedItem) return res.status(400).json({ message: "Invalid body" })
            
            
            const updatedItem =await Item.findOneAndUpdate(sku,validatedBody,{
                new:true,
                runValidators:true
            })

            if(!updatedItem){
                return res.status(404).json({message:"Item not found"})
            }

            res.status(200).json(updatedItem)



        } catch (error) {
            console.error("Error updateing Item ",error)
            res.status(500).json({message:"Internal server error"})
        }

    }

    export const deleteItem = async(req,res)=>{
        const {sku} = req.params

        try{
            // NOTA: find() nunca devuelve error al no encontrar nada
            const result = await Item.deleteOne({ sku })

            if (result.deletedCount === 0) {
                return res.status(404).json({
                    message: "Item not found"
                })
            }

            res.status(200).json({message:"Item has been deleted"})

        }catch(error){
            console.error("Error Deleting Item ",error)
            res.status(500).json({message:"Internal server error"})
        }
    }

    