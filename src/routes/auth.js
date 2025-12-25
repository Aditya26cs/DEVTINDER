const express = require("express");

// const app = express();
const authRouter = express.Router();
const User = require("../models/user");
const { validateSignupData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignupData(req);
    // console.log("validate successfully")

    const { firstName, lastName, emailId, password, age, gender, image } =
      req.body;

    const hashPass = await bcrypt.hash(password, 5);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashPass,
      age,
      gender,
      image,
    });

    const savedUser = await user.save();
    const token = await savedUser.getJWT();
    // console.log(token)

    res.cookie("token", token, {
      expires: new Date(Date.now() + 3 * 3600000),
      httpOnly: true,
      sameSite: "none",
      secure: true
    });

    res.send({ message: "user added successfully", data: savedUser });
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
    // console.log(isPasswordValid);

    if (isPasswordValid) {
      // create a jwt token

      const token = await user.getJWT();
      // console.log(token)

      res.cookie("token", token, {
        expires: new Date(Date.now() + 3 * 3600000),
        httpOnly: true, // not accessible from JS
        secure: true, // MUST be true on HTTPS (production)
        sameSite: "none", // required for cross-site cookies
        path: "/",
        maxAge: 24 * 60 * 60 * 1000, // optional
      });
      // add token to a cookie  -> send back the response to the client with this cookie.

      res.send(user);
      //console.log(user);
    } else {
      throw new Error("password is incorrect");
    }
  } catch (err) {
    res.status(400).send("error found " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("user logout successfully");
});

module.exports = authRouter;
