const express = require("express");

// const app = express();
const authRouter = express.Router();
const User = require("../models/user") 
const {validateSignupData} = require("../utils/validation")
const bcrypt = require("bcrypt")
const validator = require("validator");


authRouter.post("/signup", async (req, res) => {
  try {
    validateSignupData(req);
    // console.log("validate successfully")

    const { firstName, lastName, emailId, password } = req.body;

    const hashPass = await bcrypt.hash(password, 5);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashPass,
    });
    await user.save();
    res.send("user added successfully");
  } catch (err) {
    res.status(400).send("error occur " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  // console.log(req.body);
  try {
    if (!validator.isEmail(emailId)) {
      throw new Error("enter correct email");
    }

    const user = await User.findOne({
      emailId: emailId,
    });

    if (!user) {
      throw new Error("email is not found ");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      // create a jwt token

      const token = await user.getJWT();
      // console.log(token)

      // add token to a cookie  -> send back the response to the client with this cookie.

      res.cookie("token", token, {
        expires: new Date(Date.now() + 3 * 3600000),
      });

      res.send("user login successful");
      //console.log(user);
    } else {
      throw new Error("password is not correct");
    }
  } catch (err) {
    console.log(err);
    res.status(400).send("error found" + err.message);
  }
});

authRouter.post("/logout" , async(req, res) => {

res.cookie("token" , null , {
  expires: new Date(Date.now())
})
res.send("user logout successfully")
})

module.exports = authRouter;
