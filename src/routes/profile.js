const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const { validationEditProfileData ,  isValidPassword} = require("../utils/validation");
const bcrypt = require("bcrypt")

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

profileRouter.patch("/profile/password" ,userAuth , async (req, res) => {
      // check the user is login or not
      // check the current password
      // check the new password valid or not
      // change the new password with previous one

      try{
      const user = req.user;
      const {oldPassword , newPassword} = req.body;
      const isOldPasswordCorrect =  await bcrypt.compare(oldPassword, user.password);
      if(!isOldPasswordCorrect){
        return res.status(400).json({ message: "Old password is incorrect" });
      }

      const isNewPasswordValid = isValidPassword(newPassword);

      if(!isNewPasswordValid){
        return res.status(400).json({
        message: "New password must start with a capital letter, be at least 8 characters long, include at least one number and one symbol.",
      });
      }
      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();
      res.status(200).json({ message: "Password changed successfully." });

      }
      catch(err){
              res.status(500).json({ message: err.message || "Server error" }); 
      }

} )


module.exports = profileRouter;
