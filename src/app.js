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

// ✔ JavaScript Object → Used in JavaScript code, supports functions & variables.
// ✔ JSON → Used for data storage & exchange, only supports simple data types.
// ✔ Use JSON.stringify() to convert JS object → JSON string.
// ✔ Use JSON.parse() to convert JSON string → JS object.

const User = require("./models/user") 

app.use(express.json());
// this middleware help to read the request comming in the form of json form and convert it into js object and send 
// back to the request.body. without it server will not understood the data(show "undefined) that was send through client in json format.


const {validateSignupData} = require("./utils/validation")
const bcrypt = require("bcrypt")
const validator = require("validator");

app.post("/signup" , async (req,res) => {
  
    //   console.log(req.body);

    // const user = new User({
    //     firstName: "aditya",
    //     lastName: "maheshwari",
    //     age: 21,
    //     gender: "male",
    //     emailId: "adi@com",
    //     password:"adi"
    // });

    // validation of user data
  
    try{
        validateSignupData(req)
        // console.log("validate successfully")

        const {firstName , lastName , emailId , password} = req.body

        const hashPass = await bcrypt.hash(password , 5);

        const user = new User({
            firstName,
            lastName,
            emailId,
            password : hashPass,
        })
        await  user.save();
        res.send('user added successfully')
    }
    catch(err){
       res.status(400).send("error occur " +  err.message)
    }
})

app.get("/user" , async(req, res) => { 

    const email = req.body.emailId
     
    try{
        const user = await User.findOne({
            emailId : email
        })
        res.send(user)
        // it send array of objects
    }
    catch(err){
       res.status(400).send("user not found")
    }
})


       // to fetch all the users we have to use the -> User.find({}).
 

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
 
app.patch("/user/:userId" , async (req, res) => {

    const emailId = req.params?.userId;
    const data = req.body;
 
    try{

    const Update_Allowed = ["about" , "gender" , "age" , "skills"];

    const isUpdateAllowed = Object.keys(data).every((k) => {
        return Update_Allowed.includes(k);
    })

    if(!isUpdateAllowed){
          res.status(400).send("Update not allowed for some fields");
    }

    const user  = await User.findByIdAndUpdate(emailId, data , {
        runValidators : true,
        returnDocument : "after"
    })
        res.send("updated successfully")
        console.log(user)
    }catch(err){
        res.status(400).send("error found")
    }
})


const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser")
app.use(cookieParser());
// cookie-parser is a middleware for Express.js that helps us read cookies sent by the browser.



app.post("/login" , async (req, res) => {

 const {emailId , password} = req.body;

  try{
    if(!validator.isEmail(emailId)){
        throw new Error("enter correct email")
     }
    
     const user = await User.findOne({
        emailId : emailId
     })
    
    if(!user){
        throw new Error("email is not found ")
    }
    
    const isPasswordValid = await bcrypt.compare(password , user.password)
    if(isPasswordValid){

        // create a jwt token   

        const token = await jwt.sign({_id : user._id} , "devTinder@123");
        // console.log(token)

        // add a token to a cookie  -> send back the response to the client with this cookie.

        res.cookie("token" , token);

        
        res.send("user loggin successful")
        //console.log(user); 
    }else{
        throw new Error("password is not correct")
    }
  }
  catch(err){
    res.status(400).send("error found" + err.message)
  }

})

app.get("/profile" , async (req, res) => {


   try{
    const cookie = req.cookies;
    // console.log(cookie)
    const {token}  = cookie;

    if(!token){
        res.send("token is not valid")
    }
    // now we have to validate this token

     const decodedMessage = await jwt.verify(token , "devTinder@123");

    //  console.log(decodedMessage);

     const {_id} = decodedMessage;
     const user  = await User.findById(_id);
     res.send(user);
   }
   catch(err){
    res.status(400).send("error found" + err.message)
   }
 
}) 