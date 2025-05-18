const  express = require("express")
const requestRoute  = express.Router();
const {userAuth} = require("../middleware/auth")

requestRoute.post("/sendConnectionRequest" , userAuth ,  (req, res) => {
     
    const user = req.user;
    res.send(user.firstName + "  sends a connection request")
})

module.exports = requestRoute;