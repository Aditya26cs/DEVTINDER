const express = require("express");
const userRoute = express.Router();

const { userAuth } = require("../middleware/auth");
const user = require("../models/user");
const ConnectionRequests = require("../models/ConnectionRequest");

// GET ALL THE PENDING CONNECTING REQUESTS for the LOGGED IN USER
userRoute.get("/user/requests", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    // console.log(loggedInUser);
    const connectionRequests = await ConnectionRequests.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", "firstName lastName age gender about image");

    res.json({
      message: "Connection Requests fetched successfully",
      connectionRequests,
    });
  } catch (err) {
    res.status(400).send("error found " + err.message);
  }
});

userRoute.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connections = await ConnectionRequests.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", [
        "firstName",
        "lastName",
        "image",
        "about",
        "skills",
        "age",
      ])
      .populate("toUserId", [
        "firstName",
        "lastName",
        "image",
        "about",
        "skills",
        "age",
      ]);

    const data = connections
      .map((connection) => {
        // skip if any user is null
        if (!connection.fromUserId || !connection.toUserId) return null;

        if ( connection.fromUserId._id.toString() === loggedInUser._id.toString()) {
          return connection.toUserId;
        }
        return connection.fromUserId;
      })
      .filter((c) => c !== null); // remove null entries

    res.json({ message: "Connections fetched successfully", data });
  } catch (err) {
    res.status(400).send("error found " + err.message);
  }
});

userRoute.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    // user should see all the user card excepts
    // myself
    // my connections
    // ignored people
    // already send connection request

    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 50); // never > 50
    const skip = (page - 1) * limit;

    const connectionRequests = await ConnectionRequests.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    })
      .select("fromUserId toUserId status")
      .populate("fromUserId", "firstName lastName ")
      .populate("toUserId", "firstName lastName ");

    const hideUserFromFeed = new Set();

    connectionRequests.forEach((request) => {
      if (request.fromUserId) {
        // request.fromUserId may be a populated object OR an ObjectId — handle both
        const fromId = request.fromUserId._id
          ? request.fromUserId._id.toString()
          : String(request.fromUserId);
        hideUserFromFeed.add(fromId);
      }

      if (request.toUserId) {
        const toId = request.toUserId._id
          ? request.toUserId._id.toString()
          : String(request.toUserId);
        hideUserFromFeed.add(toId);
      }
    });

    // console.log(hideUserFromFeed);

    const users = await user
      .find({
        $and: [
          { _id: { $nin: Array.from(hideUserFromFeed) } },
          { _id: { $ne: loggedInUser._id } }, // not myself
        ],
        // show those whoes _id is not present in the hideUserFromFeed array
      })
      .select("firstName lastName age about skills image gender")
      .skip(skip)
      .limit(limit);

    res.json({ message: "Feed fetched successfully", users });
  } catch (err) {
    res.status(400).send("error found " + err.message);
  }
});

module.exports = userRoute;
