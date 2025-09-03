const express = require("express");
const requestRoute = express.Router();
const { userAuth } = require("../middleware/auth");
const user = require("../models/user");
const ConnectionRequest = require("../models/ConnectionRequest");

requestRoute.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["interested", "ignored"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Invalid status type",
        });
      }

      const toUser = await user.findById(toUserId);
      if (!toUser) {
        return res.status(400).send("user not found");
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res
          .status(400)
          .json({ message: "Connection request already sent" });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      res.status(201).json({
        message:
          req.user.firstName +
          " send the connection request to " +
          toUser.firstName,
        data,
      });
    } catch (err) {
      return res.status(400).send("ERROR   " + err.message);
    }
    // res.send(user.firstName + "send the connection request");
  }
);

requestRoute.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      // person A to person B
      // logged in user is person B (toUserId)
      // status = interested
      // requestId should be valid

      const LoggedInUser = req.user;

      const allowedStatus = ["accepted", "rejected"];
      const status = req.params.status;
      const requestId = req.params.requestId;

      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Invalid status type" });
      }

      const connectionRequest = await ConnectionRequest.findById({
        _id: requestId,
        toUserId: LoggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res.
        status(404).
        json({ message: "Connection request not found" });
      }

      connectionRequest.status = status;
      const data =  await connectionRequest.save();

        res.json({
          message: "Connection request " + status,
          data
        });
        
    } catch (err) {
      res.status(400).send("Error " + err.message);
    }
  }
);

module.exports = requestRoute;
