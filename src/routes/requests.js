const  express = require("express")
const requestRoute  = express.Router();
const {userAuth} = require("../middleware/auth");
const user = require("../models/user");
const ConnectionRequest = require("../models/ConnectionRequest");
 

requestRoute.post("/request/send/:status/:toUserId" , userAuth ,  async (req, res) => {

    try{

     const fromUserId = req.user._id;
     const toUserId = req.params.toUserId;
     const status = req.params.status;


     const allowedStatus = ["interested" , "ignored"];
     if(!allowedStatus.includes(status)){
           return res.status(400).json({
            message: "Invalid status type"
           })
     }

     const existingConnectionRequest = await ConnectionRequest.findOne({
         $or :  [
            {fromUserId , toUserId},
            {fromUserId: toUserId , toUserId : fromUserId }
         ]
     })

     if(existingConnectionRequest){
        return res.status(400).json({ message: "Connection request already sent" });
     }
     
    const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status
    })

     const data = await connectionRequest.save();

     res.status(201).json({
        message: "Connection request send successfully",
        data
     }); 
     
    }
    catch(err){
       return res.status(400).send("ERROR   " + err.message);
    }
    // res.send(user.firstName + "send the connection request");
    
})

module.exports = requestRoute;