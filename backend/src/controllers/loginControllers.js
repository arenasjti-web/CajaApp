    import User from "../models/User.js";
    import bcrypt from "bcrypt";


    export const login = async (req,res)=>{
        
        try {
            const {username,password} = req.body
            const user = await User.findOne({
                username:username,
            });
            const usuarios = await User.find()
            // console.log("username recibido:", username);
            // console.log("usuarios",usuarios);

            // console.log("DB:", User.db.name);
            // console.log("COLLECTION:", User.collection.name);       

            if (!user) {
                return res.status(401).json({ message: "Credenciales inválidas 1" });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            //const passhashed = await bcrypt.hash(password,10);
           

            if (!isPasswordValid) {
                return res.status(401).json({ message: "Credenciales inválidas 2" });
            }

            res.status(200).json({
                id: user._id,
                username: user.username,
                role: user.role
            });
        
        } catch (error) {
            console.error("Error Login in",error)
            res.status(500).json({message:"Internal server error"})
        }
    }


    //test 1234
    //$2b$10$wq8vYtJw7m3H9y5m0YxRGu6f2XnKq0uPZ7Jc3yqz4YF6d3vZ9KZ1W
