const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const { validateSignupData, validationEditProfileData } = require("../utils/validation");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("error found" + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validationEditProfileData(req)) {
      throw new Error("Invalid edit request");
    }
    const loggedInUser = req.user;
    // console.log(loggedInUser);

    Object.keys(req.body).forEach((k) => (loggedInUser[k] = req.body[k]));
     await loggedInUser.save();
     //console.log("updated user " + loggedInUser)
     res.json({
       message :  `${loggedInUser.firstName}, your profile is updated successfully`,
       data : loggedInUser
     }
    )
  } catch (err) {
    // console.error("Error:", err);
    res.status(400).send("error found " + err.message);
  }
});

module.exports = profileRouter;
