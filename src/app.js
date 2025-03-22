const express = require("express");
const connectDb = require("./config/database");
const app = express();
 

connectDb()
.then(() => {
    console.log("database connected successfully")
    app.listen(3000);
})
.catch((err) => {
 console.error("database not connected ")
})

// function takes two thing path and (middleware) . it can be as many router handler function

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


// app.use("/user" , (req, res) =>{
//     res.send("ohh my god")
// })

// this will only handle get call to "/user"

// dynamic routing 

// app.get("/user/:userID" , (req, res) => {
//    // console.log(req.query);
//    console.log(req.params);
//     res.send({
//         "name" : "aditya",
//         "age" : 21,
//     })
     
// })

//   //this will only handle post call to "/user"

// app.post("/user" , (req, res) => {
//     res.send("send is saved to db")
// })

// // this will only handle delete call to "/user"
// app.delete("/user" , (req, res) => {
//     res.send("data delete succesfully")
// })

// // this will handle all the http method ( get , post , etc ) api call to "/test"
// app.use("/test", (req, res) => {
//     res.send("hello aditya welcome you to server");
// }) 

// app.use("/" , (req, res) => {
//      res.send("namaste node");
// })


// in this 2 is optional because of ? , "2+" means we add as many 2 , "*" means we can write any thing in place of *.
//                 --->  /a/  means whenever a appear in a path it will work

// app.get(/a/ , (req, res) => {
//     res.send("lets see what happen")
// })


//  get /user =>  middleware chain => request handler (route handler)
// express js checks all the route and goes to each middleware and finally a function comes which send request called   
// request handler.

// app.use(
//     "/user" , 
//     (req, res, next) => {
//          console.log(" first   response here")
//         // res.send("first response");
//          next();
//     }, 
//     (req,res ,next) => {
//         console.log(" second response here")
//          // res.send("2nd response send")
//          next();
//     },
//     (req,res, next) => {
//         console.log("third response here")
//         // res.send("2nd response send")
//         next();
//     },
//     (req,res) => {
//          res.send("4th response send")
//     }
// )

// it does not possible to send the request on the same route. because the connection between client and server is disconnected.
// after client recieve a first response . 


 

const {adminAuth, userAuth} = require("./middleware/auth")
app.use("/admin" , adminAuth)
// app.use("/user" , userAuth)

app.get("/admin/data", (req,res) => {
       
      res.send("all data send")
})

app.post("/user/login",  (req,res) => {
    res.send("login succesful")
})

app.post("/user/data", userAuth,  (req,res) => {
    res.send("data is send succesful")
})

// error handling 


// Error Handling Middleware
// app.use("/", (err, req, res, next) => {
//     if(err){
//         res.status(500).send("something went wrong")
//     }
// })


// app.get("/getUserData" ,(req,res) => {
     
//     // database logic
//      try{
//         throw new Error("wrongggggg.......")
//         res.send("user data send") 
//     }
//     catch(error){
//         res.status(500).send("something went wrongggg")
//     }

   
// })

// app.use("/", (err, req, res, next) => {
//     if(err){
//         res.status(500).send("something went wrong")
//     }
// })

 
                      //********************************************/

const User = require("./models/user") 
app.post("/signup" , async (req,res) => {
    
    const user = new User({
        firstName: "aditya",
        lastName: "maheshwari",
        age: 21,
        gender: "male",
        emailId: "adi@com",
        password:"adi"
    });
   
    try{
        await  user.save();
        res.send('user added successfully')
    }
    catch(err){
       res.status(400).send("error occur")
    }
})                      
 



 

