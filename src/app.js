const express = require("express");

const app = express();

app.listen(3000);

// app.use("/" , (req, res) => {
//      res.send("namaste node");
// })

//  if routing start with "/" then it handle all request comes on it and also handle all the request comes after "/...".
// order of  writing a route matters.

// app.use("/hello/1" , (req, res) => {
//     res.send("abra ka dabra");
// })

// app.use("/hello" , (req, res) => {
//     res.send("hello hello");
// })

// app.use("/hello/1" , (req, res) => {
//     res.send("abra ka dabra");
// })


app.use("/user" , (req, res) =>{
    res.send("ohh my god")
})

// this will only handle get call to "/user"

app.get("/user" , (req, res) => {
    res.send({
        "name" : "aditya",
        "age" : 21,
    })
})

// this will only handle post call to "/user"

app.post("/user" , (req, res) => {
    res.send("send is saved to db")
})

// this will only handle delete call to "/user"
app.delete("/user" , (req, res) => {
    res.send("data delete succesfully")
})

// this will handle all the http method ( get , post , etc ) api call to "/test"
app.use("/test", (req, res) => {
    res.send("hello aditya welcome you to server");
}) 

app.use("/" , (req, res) => {
     res.send("namaste node");
})

 

