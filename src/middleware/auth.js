const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    // here we get all the cookies save in the browser/postmen/client
    // .
    // console.log(token);
    if (!token) {
      res.send("token is not valid");
    }

    // now we have to validate this token

    const decodedMessage = jwt.verify(token, "devTinder@123");

    // console.log("decoded message " + decodedMessage);

    const { _id } = decodedMessage;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("user not found");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("error found omg " + err.message);
  }
};

module.exports = {
  userAuth,
};
