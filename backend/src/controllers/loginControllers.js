import User from "../models/users"


export const login = async (req,res)=>{
    
    try {
        const {username,password} = req.body
        const userCheck = await User.findOne({
            username: username,
            password: password
        });

        
       
    } catch (error) {
        
    }
}