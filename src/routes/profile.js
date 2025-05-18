const express = require("express");
const profileRouter = express.Router();
const {userAuth} = require("../middleware/auth")

profileRouter.get("/profile" , userAuth , async (req, res) => {

   try{
     const user = req.user;
     res.send(user);
   }
   catch(err){
    res.status(400).send("error found" + err.message)
   }
})


profileRouter.patch("/user/:userId" , async (req, res) => {

    const UserId = req.params?.userId;
    const data = req.body;
 
    try{

    const Update_Allowed = ["about" , "gender" , "age" , "skills"];

    const isUpdateAllowed = Object.keys(data).every((k) => {
        return Update_Allowed.includes(k);
    })
    
      console.log("Update allowed?", isUpdateAllowed);

    if(!isUpdateAllowed){
        return  res.status(400).send("Update not allowed for some fields");
    }

    const user  = await User.findByIdAndUpdate(UserId, data , {
        runValidators : true,
        new : true
    })
        // console.log("Updated user:", user);
        res.send("updated successfully")
        console.log(user)
    }catch(err){
        // console.error("Error:", err);
        res.status(400).send("error found" + err.message)
    }
})

module.exports = profileRouter;