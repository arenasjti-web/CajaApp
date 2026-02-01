    import Item from "../models/Item.js";
    import Brand from "../models/Brand.js"
    import Provider from "../models/Provider.js"
    import mongoose from "mongoose";
    import csv from "csv-parser";
    import fs from "fs";
    import { randomUUID } from "crypto";
   

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
        
        if(validatedBody.provider === "") delete validatedBody.provider
        if(validatedBody.category === "") delete validatedBody.category
        
        
        // Campos opcionales que quiza no vengan
        //undefined null "" false
        validatedBody.category = (data?.category) ? data.category : "Otros"
        if((!data?.ppu && data?.ppm) || (data?.ppu && !data?.ppm)){
            // solo una de las 2 a la vez
            if(data?.ppu && data?.content) 
            {
                const inferedContent = inferredContent(validatedBody.name,"(und|unds|pcs)")
                validatedBody.ppu=data.ppu
                validatedBody.content = inferedContent
                validatedBody.stock *= inferedContent
                validatedBody.lowStockThreshold *= inferedContent
            }
            if(data?.ppm && data?.unit) 
            {
                validatedBody.ppm = data.ppm
                validatedBody.unit = data.unit  
                const inferedContent = inferredContent(validatedBody.name,data.unit)
                validatedBody.content  = inferedContent
                validatedBody.stock *= inferedContent 
                validatedBody.lowStockThreshold *= inferedContent
                // si venia con unidad de medida entonces transformamos el stock en n*content ( ej: 5 x 20kg => stock: 100). con esto si vendo por paquete resto el peso del paquete y si vendo por peso resto el peso vendido
            }
        }
        
        
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
    
    function inferredContent(name,unit) {
        if(!name || !unit) return null

        const isRegexUnit = unit.startsWith('(') && unit.endsWith(')')// si mando un string como (kg|g) esto lo permite

        const safeUnit = isRegexUnit
        ? unit
        : unit.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        // permitidmos cosas como m^2 porsiaacaso

        const regex = new RegExp(
            `(\\d+(?:[.,]\\d+)?)\\s*${safeUnit}\\b`,// numero seguido de , opcionalmente; decimales con punto o coma y posibles espacios en blanco más la unidad de medida que viene del form
            'i'
        )

        const match = name.match(regex)
        if (!match) return null

        return parseFloat(match[1].replace(',', '.'))// dejamos con . decimal si o si 
    }   

    export const importCsv = async(req,res)=>{
        // from CSV?. make it later as an extra feature
       if (!req.file) return res.status(400).send("No se recibió archivo");
        const REQUIRED_HEADERS = ["sku", "name", "price","stock"];// si el csv proporcionado no tiene estos al menos entonces no se puede seguir
        const importId = randomUUID();
        console.log(importId)// para luego borrar manualmente durante etapa de pruebas


        const resultados = [];
        let hasBrand = false;
        let hasProvider = false;
    
        fs.createReadStream(req.file.path)
        .pipe(csv())// csv() es lo unico propio de csv-parser en este codigo
        .on("headers", (headers) => {
            if (headers.every(h => !h || h.trim() === "")) {
                throw new Error("CSV sin headers válidos");// esto evita un pair value que luzca asi {"":Value} al toparse nada en la primera fila
            }
            const normalized = headers.map(h =>
                h
                .replace(/\s*\(.*?\)\s*/g, "") // elimina cualquier "(...)" y los espacios alrededor
                .trim()
                .toLowerCase()
        );

    
            // veo que no falte ninguno de los headers obligatorios, si falta queda en missing y se notifica cual falta
            const missing = REQUIRED_HEADERS.filter(
                 h => !normalized.includes(h)
            );
    
            if (missing.length > 0) {
                throw new Error(
                    `CSV inválido. Faltan columnas: ${missing.join(", ")}`
                );
            }
    
        })
        .on("data", (row) => {
            resultados.push(row);
        })
        .on("end", async() => {
            console.log(resultados);
            try{
                //
               const { insertedCount,errors } = await insertItems(resultados)
    
               if(insertedCount===0) return res.status(400).json({errors})
    
                res.status(200).json({insertedCount,errors})
            }catch(error){
                console.log(error)
            }
            finally{
                fs.unlinkSync(req.file.path);
            }
        });
    
    

        
    }

async function insertItems(resultados){
    if(resultados.length=== 0) throw new Error("Sin Items")
    const importId = randomUUID();
    let errors=[]
    let itemsToInsert = []
    
    for (const [index, row] of resultados.entries()) {// antes era un foreach pero esto nunca espera promesas y no servia el await. la otra opción era un await Promise.all() encapsulando todo
        row.importId = importId;
        try {
            // provider y brand son ref a objectId de su propio modelo. necesito buscar ese Id y remplazar el string antes de insertar a item
            if (row.provider?.trim()) {// evito " "  que es truthy
                await checkForProvider(row)
            
            }
            if(row.brand?.trim()){
                await checkForBrand(row)
            }
            if(row.items){
                // esto es el o los objetos a los que referencia un pack. el modelo espera objectId pero es razonable que aqui el usuario ingrese SKUs por lo que hay que buscarlos
                await validatePacks(row)
            }

            await validateRequieredFields(row)

            // asumiendo que no hay errores que haya olvidado checkear:
            itemsToInsert.push(row)
        } catch (error) {
            errors.push({
                row: index+1,
                error,
                data:row
            })
        }finally{
            console.log("errors:",errors)
        }
    }

    try {
        var insertedCount = 0;

        const result = await Item.insertMany(itemsToInsert, { ordered: false });// sin el ordered :false algún constraint como duplicados/unique da error y rompe el flujo
        
        insertedCount = result.length;
       

        
    }catch (error) {
        if (error.code === 11000) {
            // duplicados ignorables
            console.warn("Algunos documentos ya existían y no se insertaron");
        } else {
            // error real
            console.log(error)
            throw err;
        }
    }

    return { insertedCount, errors };

}

async function checkForBrand(row) {
    const value = row.brand?.toString().trim()

    // 1️⃣ Si ya es un ObjectId válido → solo verifico que exista
    if (mongoose.Types.ObjectId.isValid(value)) {
        const exists = await Brand.exists({ _id: value })
        if (!exists) throw new Error("brand no existe en la BD")
        row.brand = value
        return
    }

    // 2️⃣ Si NO es ObjectId → lo trato como nombre
    const brand = await Brand.findOne({ name: value })
    if (!brand) throw new Error("marca no existe en la BD")
    row.brand = brand._id
}

async function checkForProvider(row){
    
    const value = row.provider?.toString().trim()

    // 1️⃣ Si ya es un ObjectId válido → solo verifico que exista
    if (mongoose.Types.ObjectId.isValid(value)) {
        const exists = await Provider.exists({ _id: value })
        if (!exists) throw new Error("provider no existe en la BD")
        row.provider = value
        return
    }

    // 2️⃣ Si NO es ObjectId → lo trato como nombre
    const provider = await Provider.findOne({ name: value })
    if (!provider) throw new Error("provider no existe en la BD")
    row.provider = provider._id
}

async function validatePacks(row){
    const formatedItems = []
    const items = parseItems(row.items)// devuelve arreglo con pares de valores ( sku: " ", qty: number)

    for( const {sku,qty} of items){
        const foundItem = await Item.findOne({sku})
        if(!foundItem) throw new Error(`SKU: <<${sku} >>no corresponde a un objeto en la BD por lo que pack <<${row.sku}>> no pudo agregarse`)
        formatedItems.push({item:foundItem._id,qty})
    }

    row.items = formatedItems
}

function parseItems(itemsRaw) {
    if (!itemsRaw?.trim()) return [];

    // items viene en formato : "sku1:qty1,sku2:qty2"
    return itemsRaw.split(",").map(pair => {
        const [sku, qty] = pair.split(":");

        if (!sku || !qty) {
            throw new Error(`Formato inválido en items: "${pair}"`);
        }

        const quantity = Number(qty);

        if (!Number.isInteger(quantity) || quantity <= 0) {
            throw new Error(`Cantidad inválida para SKU ${sku}`);
        }

        return {
            sku: sku.trim(),
            qty: quantity
        };
    });
}

async function validateRequieredFields(row){

    // si el csv traia un blank en el campo sku trato de crear uno único. 10 intentos máximo
    if(!row?.sku?.trim()){
       
        //falta el sku, genero uno aleatorio
        const max_tries = 10;
        let uniqueSku =false;
        let sku;
        for(let i = 0; i<max_tries;i++){
            sku = generateInternalCode()
            const exists = await Item.exists({sku})// al parecer exists es mas rapido que findOne
            if(!exists) {
                uniqueSku= true
                row.sku = sku
                break
            }
            
        }
        if(!uniqueSku) throw new Error("No se pudo crear codigo de barra único") 

    }
    if(!row.name?.trim() || !row?.price || !row?.stock ) throw new Error("Faltan campos obligatorios")

    if(row.price<0 || row.stock<0 || row.lowStockThreshold <0) throw new Error("No puede haber valores menores a 0")
    

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

function generateInternalCode() {
    const prefix = "MANE"; // jamás usado por productos reales
    const random = Math.random().toString(36).substring(2, 10).toUpperCase();// toStrin(36) => base 36 => 0–9 + a–z
    return `${prefix}-${random}`;
}
