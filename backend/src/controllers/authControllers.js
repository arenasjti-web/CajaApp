    import User from "../models/User.js";
    import bcrypt from "bcrypt";
    import jwt from "jsonwebtoken"


    export const login = async (req,res)=>{
        
        try {
            const {username,password} = req.body
            const user = await User.findOne({
                username:username,
            });
            const usuarios = await User.find()   

            if (!user) {
                return res.status(401).json({ message: "Credenciales inválidas" });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            //const passhashed = await bcrypt.hash(password,10);
           

            if (!isPasswordValid) {
                return res.status(401).json({ message: "Credenciales inválidas" });
            }

            const token = jwt.sign(
                { id: user._id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES }
            )

            res.json({ token })


        
        } catch (error) {
            console.error("Error Login in",error)
            res.status(500).json({message:"Internal server error"})
        }
    }

     export const register = async (req,res)=>{

        try {
            const {username,password} = req.body;

            const alreadyExists = User.find({username})

            if(alreadyExists){
               return res.status(401).json({ message: "Username already in use" });
            }

            const hashedPassword = await bcrypt.hash(password,10);
            const newUser = User.create(username,hashedPassword)

            res.status(200).json(newUser)
        } catch (error) {
            console.error("Error Registering user",error)
            res.status(500).json({message:"Internal server error"})
        }
     }

    //test 1234
    //$2b$10$wq8vYtJw7m3H9y5m0YxRGu6f2XnKq0uPZ7Jc3yqz4YF6d3vZ9KZ1W
