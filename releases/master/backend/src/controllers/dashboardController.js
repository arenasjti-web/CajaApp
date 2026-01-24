import Sale from "../models/Sale.js";
import Item from "../models/Item.js";
import User from "../models/User.js";
import mongoose from "mongoose";

export const fetchRevenue = async(req,res)=>{
    const now = new Date()

    // Primer día del mes actual
    var startOfCurrentMonth = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
    )

    // Primer día de hace 5 meses (incluyendo el actual = 6)
    var start = new Date(
        startOfCurrentMonth.getFullYear(),  
        startOfCurrentMonth.getMonth() - 5,
        1
    )

    // Último día del mes actual
    var end = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59
    )


    try {
        // the last six months
        const { selectedItem,monthRangeMin,monthRangeMax,category } = req.query
        

        // si no existe usa los ultimos 6 meses por defecto
        if(monthRangeMin && monthRangeMax){
            start = monthRangeMin ? new Date(monthRangeMin) : (() => { let d = new Date(); d.setMonth(d.getMonth()-6); return d; })();
            end = monthRangeMax ? new Date(monthRangeMax) : new Date();

        }


        let matchBase = {
            status: "paid",
            createdAt: { $gte: start, $lte: end }
        };

        var revenue ={}
        if(!category){
            
            // el match no funcionaba haciendo item.id = selectedItem ( un string)
            const itemId =
                selectedItem && mongoose.Types.ObjectId.isValid(selectedItem)
                ? new mongoose.Types.ObjectId(selectedItem)
                : null;
    
            // // NO FUNCIONA pese a ser igual a lo de arriba.que mierda ctm ?
            // let itemId = null;
            // if (selectedItem && mongoose.Types.ObjectId.isValid(selectedItem)) {
            // itemId = mongoose.Types.ObjectId(selectedItem);
            // }
           revenue = await salesPerItem(matchBase,itemId,start,end)
           return  res.json(revenue);
        }else{
           
            revenue = await salesPerCategory(matchBase)
            return  res.json(revenue);
        }

  
    } catch (error) {
        console.log("error retrieving revenue data")
        return res.status(500).json({ message: "Internal server error" })
    }
}

async function salesPerItem (matchBase,itemId ){
    let revenue = await Sale.aggregate([
            { $match: matchBase },
            { $unwind: "$items" },
            ...(itemId ? [{ $match: { "items.itemId": itemId } }] : []),
            { $group: {
                _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
                totalAmount: { $sum: { $multiply: ["$items.priceAtSale", "$items.quantity"] } }
                }
            },
            { $project: { _id:0, date: { $dateFromParts: { year:"$_id.year", month:"$_id.month", day:1 } }, totalAmount:1 } },
            { $sort: { date:1 } }
        ]);

        return revenue
}

async function salesPerCategory(matchBase ){
    let revenue = await Sale.aggregate([
        {$match:matchBase},
        { $unwind: "$items" },
        { $group:
            {
                _id:{ year: { $year: "$createdAt" }, month: { $month: "$createdAt" },category: "$items.category" },
                totalAmount: {$sum: {$multiply: ["$items.priceAtSale", "$items.quantity"]}  }
            }
        },
        {$project: { _id:0,date: { $dateFromParts: { year:"$_id.year", month:"$_id.month", day:1 } },category:"$_id.category",totalAmount:1}},
        { $sort: { date:1 } }
        

    ])

    return revenue
}

export const fetchStats = async(req,res)=>{
    try {
        const stats={}
        const monthlyRevenue = await getMonthlyRevenue()
        const monthlySaleCount = await getMonthlySaleCount()
        const lowStockCount = await getLowStockCount() 


        if(monthlyRevenue) stats.firstStat = {
            statName:"Ganancias del Mes",
            stat:monthlyRevenue,
        }
        if(monthlySaleCount) stats.secondStat = {
            statName:"Ventas del mes",
            stat:monthlySaleCount
        }
        if(lowStockCount) stats.thirdStat = {
            statName:"Objetos Escasos",
            stat:lowStockCount
        }

        return res.status(200).json(stats)
    } catch (error) {
        
    }
}

async function getMonthlyRevenue(params) {

    const now = new Date()

    // Primer día del mes actual
    const start = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
    )

    // Último día del mes actual
    const end = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59
    )

    const result = await Sale.aggregate([
        {
            $match: {
            status: "paid",
            createdAt: { $gte: start, $lte: end }
            }
        },
        {
            $group: {
            _id: null,
            totalAmount: { $sum: { $toDouble: "$totalAmount" } }
            }
        }
    ])

    return result[0]?.totalAmount || 0




}

async function getMonthlySaleCount(params) {
       const now = new Date()

    // Primer día del mes actual
    const start = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
    )

    // Último día del mes actual
    const end = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59
    )

    const saleCount = await Sale.countDocuments({
        status: "paid",
        createdAt: { $gte: start, $lte: end }
    })

    return saleCount
}

async function getLowStockCount(params) {

    const lowStockCount = await Item.countDocuments({
        $expr: {
            $and: [
            { $gte: ["$stock", 0] },
            { $lte: ["$stock", "$lowStockThreshold"] }
            ]
        }
    })

    return lowStockCount
}

export const fetchSale = async(req,res)=>{

    try {
        const {saleId} = req.params
        
        const sale = await Sale.findOne({_id:saleId}).populate("createdBy", "username")// con esto puede luego hacer sale.createdBy.username. solo sirve para referencias

        if (!sale) {
            return res.status(404).json({ message: "Sale not found" })
        }
       

        return res.status(200).json(sale)
    } catch (error) {
        console.log("error retrieving sale data")
        return res.status(500).json({ message: "Internal server error" })
    }
}

export const fetchAllSales = async(req,res)=>{
    const now = new Date()

    var start = new Date(
       now.getFullYear(),
       now.getMonth(),
       now.getDate(),
       0,
       0,
       0,
       0
    )

    var end = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23,
        59,
        59,
        999
    )

    
    try{
        const {min,max,dateOrder,priceOrder,page,limit} = req.query
        const currentPage = Math.max(Number(page) || 1, 1)
        const currentLimit = Math.min(Number(limit) || 20, 100)
        const skip = (currentPage - 1) * currentLimit
        // se usa el rango del dia actual cuando no se recibe parametros
        if(min && max){
            start = min
            end = max 
            
        }

        let matchBase = { 
            status: "paid",
            updatedAt: { $gte: start, $lte: end }
        };

        const price = Number(priceOrder)
        const date = Number(dateOrder)

        const sort = {}

        if (price === 1 || price === -1) {
            sort.totalAmount = price
        }

        if (date === 1 || date === -1) {
            sort.updatedAt = date
        }
        // mas filtros  o un sort ser agregaria luego
        const sales = await Sale.find(matchBase).sort(sort).skip(skip).limit(currentLimit)

         const total = await Sale.countDocuments(matchBase)

        res.status(200).json({
            data: sales,
            pagination: {
                page: currentPage,
                limit: currentLimit,
                total,
                totalPages: Math.ceil(total / currentLimit)
            }
        })


    }catch(error){
        console.log("error retrieving sales data",error)
        return res.status(500).json({ message: "Internal server error" })
    }

}

