const express = require("express");
const connectDb = require("./config/database");
const app = express();
const User = require("./models/user") 
const cookieParser = require("cookie-parser")
// cookie-parser is a middleware for Express.js that helps us read cookies sent by the browser.
const cors = require("cors")

app.use(cookieParser());
app.use(express.json());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

// we have to import cors middleware to allow the frontend to access the backend api.
// by default it block the request if frontend and backend run on different port.
// credentials: true , this allow us to send the cookie from backend to frontend.  


const {userAuth} = require("./middleware/auth")

const PORT = 3000;

connectDb()
  .then(() => {
      app.listen(PORT, () => {
          console.log("✅ Database connected successfully");
          console.log(`🚀 Server running on port ${PORT}`);
      });
  })
  .catch((err) => {
      console.error("❌ Database not connected:", err); // log full error
  });


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

// this will on
// ly handle get call to "/user"

// dynamic routing 

// app.get("/user/:userID" , (req, res) => {
    // console.log(req.query);
//    console.log(req.params);
//     res.send({
//         "name" : "aditya",
//         "age" : 21,
//     })
     
// })

   //this will only handle post call to "/user"

// app.post("/user" , (req, res) => {
//     res.send("send is saved to db")
// })

 // this will only handle delete call to "/user"
// app.delete("/user" , (req, res) => {
//     res.send("data delete succesfully")
// })

// this will handle all the http method ( get , post , etc ) api call to "/test"

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


//  get "/user" =>  middleware chain => request handler (route handler)
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


 

 

// app.use("/admin" , adminAuth)
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

// ✔ JavaScript Object → Used in JavaScript code, supports functions & variables.
// ✔ JSON → Used for data storage & exchange, only supports simple data types.
// ✔ Use JSON.stringify() to convert JS object → JSON string.
// ✔ Use JSON.parse() to convert JSON string → JS object.

 
// express.json() middleware parses incoming JSON payloads, converts them into JavaScript objects, 
// and attaches them to req.body.
// app.use(express.json()); 

 
app.get("/user" , async(req, res) => { 

    // const email = req.body.emailId
     
    try{
        const user = await User.find({})
        //console.log(user)
        res.send(user)
        // it send array of objects
    }
    catch(err){
       res.status(400).send("user not found")
    }
})
// to fetch all the users we have to use -> User.find({}).
 
app.delete("/user", express.json(), async (req, res) => {
    const id = req.body.userId;

    
    try {
        const user = await User.findByIdAndDelete(id);

        if (!user) {
            console.log("No user found with ID:", id);
            return res.status(404).send("User not found");
        }

      //   console.log("User deleted successfully:", user);
      res.status(200).send("user deleted successfully");
    } catch (err) {
        // console.error("Error while deleting user:", err);
         res.status(500).send("Something went wrong");
    }
});

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRoute = require("./routes/requests");
const userRoute = require("./routes/user");

app.use("/" , authRouter);
app.use("/" , profileRouter);
app.use("/" , requestRoute);
app.use("/" , userRoute);