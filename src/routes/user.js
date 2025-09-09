const express = require("express");
const userRoute = express.Router();

const { userAuth } = require("../middleware/auth");
const user = require("../models/user");
const ConnectionRequests = require("../models/ConnectionRequest");
 


// GET ALL THE PENDING CONNECTING REQUESTS for the LOGGED IN USER
userRoute.get("/user/requests" , userAuth , async(req, res) => {
    try{

        const loggedInUser =  req.user;
        // console.log(loggedInUser);
        const connectionRequests = await ConnectionRequests.find({
            toUserId : loggedInUser._id,
            status : "interested",
        }). populate("fromUserId" , ["firstName" , "lastName"]);

        res.json({message : "Connection Requests fetched successfully" , connectionRequests});

    }
    catch(err){
        res.statusCode(400).send("error found " + err.message)
    }
})

userRoute.get("/user/connections" , userAuth , async(req, res) => {

      try{

        const loggedInUser = req.user;

        const connections = await ConnectionRequests.find({
            $or : [
                { fromUserId : loggedInUser._id , status : "accepted"},
                { toUserId : loggedInUser._id , status : "accepted"},
            ]
        }).populate("fromUserId" , ["firstName" , "lastName"])
        

        res.json({message : "Connections fetched successfully" , connections});

      }
      catch(err){
        res.statusCode(400).send("error found " + err.message)
      
      }

})

module.exports = userRoute;
