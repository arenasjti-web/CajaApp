   import Item from "../models/Item.js";
   import Brand from "../models/Brand.js"
   import Provider from "../models/Provider.js"
   import mongoose from "mongoose";

    export const getInventory = async (req,res)=>{
        
        try{
            // esta mierda no deberiahaber sido necesaria pero me tiraba errores cada vez que no traia query la wea esta
            const {filters,pagination} = req.query
            if (filters) {
                const pagination = JSON.parse(req.query.pagination);
                const currentPage = Math.max(Number(pagination.page) || 1, 1)
                const currentLimit = Math.min(Number(pagination.limit) || 20, 100)
                const skip = (currentPage - 1) * currentLimit

                //Filtros
                const filters = JSON.parse(req.query.filters);
               //const pagination = JSON.parse(pagination);
                const { filter, sort } = inventoryFilter(filters);
                const items = await Item.find(filter).sort(sort).skip(skip).limit(currentLimit);
                const total = await Item.countDocuments(filter)
                res.status(200).json({
                 data:items,
                 pagination:{   
                    page:currentPage,
                    limit:currentLimit,
                    total,
                    totalPages: Math.ceil(total / currentLimit)
                 }   
                });
            } else {
                // Si no vienen filtros, solo devuelves todo
                console.log(" no vien aqui o si ? ")
                const items = await Item.find();
                res.status(200).json(items);
            }
        }
        catch(error){
            console.error("Error in getInventory ",error)
            res.status(500).json({message:"Internal server error"})
        }

    }

     export const getOneItem = async (req, res) => {
        const { sku } = req.params

        try {
            const item = await Item.findOne({ sku })

            if (!item) {
                 return res.status(404).json({ message: "Item not found" })
            }

            let result = item.toObject()// sin esto puede fallar

            if (item.skuPack) {
                const packItem = await Item.findOne({ sku: item.skuPack })

                if (packItem) {
                    result.packPrice = packItem.price
                }
            }

            res.status(200).json(result)

        } catch (error) {
            console.error("Error in getOneItem", error)
            res.status(500).json({ message: "Internal server error" })
        }
    }


    function inventoryFilter({ search, provider, brand, price,date, stock, }){

        const filter = {}
        const sort = {}
        if (search !== "") {
            if (/^\d+$/.test(search)) {
                // solo números → SKU
                filter.sku = search
            } else {
                // texto → LIKE en name
                filter.name = { $regex: search, $options: "i" }
            }
        }

        if (provider !== "") {
            // 
            
            filter.provider = new mongoose.Types.ObjectId(provider);
        }

        if (brand !== "") {
            filter.brand = brand
        }

        

        if (price === 1 || price === -1) {
            sort.price = price
        }

        if (date === 1 || date === -1) {
            sort.createdAt = date
        }

        if (stock) {
            
            switch (stock) {
                case "En Stock":
                    console.log("1")
                    filter.stock = { $gt: 0 }
                break

               case "Bajo en Stock":
              
                    filter.$expr = {
                        $and: [
                        { $gte: ["$stock", 0] },
                        { $lte: ["$stock", "$lowStockThreshold"] }
                        ]
                    }
                break

                case "Sin Stock":
                  
                    filter.stock = 0
                break

                default:
                  
                    filter.stock = { $gt: 0 }
                    break;
            }
        }


        return {filter,sort};
    }

    export const addOneToInventory = async(req,res)=>{

        try {

            const validatedBody = await validateItem(req.body)
            if(!validatedBody) return res.status(400).json({ message: "Invalid body" })
            const newItem = await Item.create(validatedBody) // opcion de mongoose
            //const newItem = await Item.insertOne(req.body);// driver nativo
            res.status(200).json(newItem);

        } catch (error) {
            console.error("Error in addOneToInventory ",error)
            res.status(500).json({message:"Internal server error"})
        }
    }

    async function validateItem({sku,name,price,stock,lowStockThreshold,brand,provider,...data}){
        const validatedBody = {
            sku,
            name,
            price,
            stock,
            lowStockThreshold,
            brand,
            provider,  
        }

        if( !sku || !name || price === undefined || stock=== undefined){
            return null//{} es truthy por lo que no servia 
        }

        if( price <0 || stock <0 ||lowStockThreshold<0){
            return null//{} es truthy por lo que no servia 
        }

        // esto deberia quitar el campo si es que dejaron marcada la opcion por defecto del select( value="")
        // esto no deberia interrumpir el proceso. Podria haber un objeto sin proveedor
        
        if (validatedBody.provider === "") {
            delete validatedBody.provider
        }
        
        
        // Campos opcionales que quiza no vengan
        //undefined null "" false
        if(data?.unit) validatedBody.unit=data.unit
        if(data?.ppu) validatedBody.ppu=data.ppu
        
        
        // Tendré que cambiar el frontend y esto si quiero poder recibir más de un sku, para tener mas de un item asociado a un pack custom
        if(data?.skuPack && data?.packUnits) {
            validatedBody.items =[]
            if (data.packUnits <= 0) throw new Error("packUnits must be greater than 0")
            const packId = await Item.findOne({sku:data.skuPack},{_id:1})// fin devuelve [] por lo que no da error al hacer !packId
            if(!packId) throw new error("Invalid SKU for the unit item in this pack")
            validatedBody.items.push({item:packId._id,qty:data.packUnits})    

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
            
            
            const updatedItem =await Item.findOneAndUpdate({sku},validatedItem,{
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

    export const getProdivers = async (req,res)=>{
        
        try{
            
            const items = await Provider.find()

            res.status(200).json(items)
        }
        catch(error){
            console.error("Error in getProvider ",error)
            res.status(500).json({message:"Internal server error"})
        }

    }

     export const getBrands = async (req,res)=>{
        
        try{
            
            const brands = await Brand.find()

            res.status(200).json(brands)
        }
        catch(error){
            console.error("Error in getProvider ",error)
            res.status(500).json({message:"Internal server error"})
        }

    }

      export const addBrandOrProvider = async(req,res)=>{

        try {
            const result ={}
            const {name,isBrand,isProvider} = req.body
            
            if (!name) {
                return res.status(400).json({ message: "Name is required" })
            }

            if(isBrand){
                const newBrand = await Brand.create({name})
                result.newBrand = newBrand
            }

            if(isProvider){
                const newProvider= await Provider.create({name})
                result.newProvider= newProvider
                
            }
            //const newItem = await Item.insertOne(req.body);// driver nativo
            res.status(200).json(result);

        } catch (error) {
             if (error.code === 11000) {
                return res.status(409).json({ message: "Already exists" })
            }

            console.error(error)
            return res.status(500).json({ message: "Internal server error" })
        }
    }

    export const getInventoryStats= async(req,res)=>{

        const startOfMonth = new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            1,
            0, 0, 0, 0
        )

        const startOfNextMonth = new Date(
            new Date().getFullYear(),
            new Date().getMonth() + 1,
            1,
            0, 0, 0, 0
        )

        try{
            const stats = {}

            const itemsTotal = await Item.countDocuments() // cantidad de productos
            // nuevos este mes
            const newItems = await Item.countDocuments({
                createdAt:{
                    $gte: startOfMonth,
                    $lt: startOfNextMonth
                }
            })

            // último creado este mes
            const lastNewItem = await Item.findOne(
            {
                createdAt: {
                $gte: startOfMonth,
                $lt: startOfNextMonth
                }
            },
            { createdAt: 1 } // solo traigo la fecha
            )
            .sort({ createdAt: -1 })
            .lean()

            // actualizados este mes
             const updatedItems = await Item.countDocuments({
                updatedAt:{
                    $gte: startOfMonth,
                    $lt: startOfNextMonth
                }
            })

            const lastUpdatedItem = await Item.findOne(
            {
                updatedAt: {
                $gte: startOfMonth,
                $lt: startOfNextMonth
                },
                createdAt: {
                $lt: startOfMonth
                }
            },
            { updatedAt: 1 }
            )
            .sort({ updatedAt: -1 })
            .lean()
            // espero siempre 3 estadisticas. me es más facil colocar estos nombres para leerlas en el frontend
            stats.firstStat = {statName:"Total de Productos",stat:itemsTotal,lastChange:lastNewItem}
            stats.secondStat = {statName:"Nuevos Productos este Mes",stat:newItems,lastChange:lastNewItem}
            stats.thirdStat = {statName:"Actualizados este Mes",stat:updatedItems,lastChange:lastUpdatedItem}

            res.status(200).json(stats)
        }catch(error){
            res.status(500).json({ error: "Error obteniendo estadísticas" })
        }


        // al parecer esto tambien existe :
        // const [
        //   itemsTotal,
        //   newItems,
        //   updatedItems
        // ] = await Promise.all([
        //   Item.countDocuments(),
        //   Item.countDocuments({ createdAt: { $gte: startOfMonth, $lt: startOfNextMonth } }),
        //   Item.countDocuments({ updatedAt: { $gte: startOfMonth, $lt: startOfNextMonth } })
        // ])

    }