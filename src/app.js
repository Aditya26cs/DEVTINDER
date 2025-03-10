const express = require("express");

const app = express();

app.listen(3000);

app.use("/test", (req, res) => {
    res.send("hello aditya welcome you to server")
}) 

app.use("/hello" , (req, res) => {
    res.send("hello hello")
})