const jwt = require("jsonwebtoken")
const User = require("../models/user")
const  userAuth = async (req,res,next) => {
   
    try{
        const cookie = req.cookies;
        // console.log(cookie)
        const {token}  = cookie;
    
        if(!token){
            res.send("token is not valid")
        }
        // now we have to validate this token
    
         const decodedMessage = jwt.verify(token, "devTinder@123");
    
        //  console.log(decodedMessage);
    
         const {_id} = decodedMessage;
         const user  = await User.findById(_id);
         if(!user){
            throw new Error("user not found")
         }
        req.user = user;
        next();
       }
       catch(err){
        res.status(400).send("error found" + err.message)
       }
} 

module.exports= {
      userAuth
}