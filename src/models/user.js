const mongoose = require("mongoose");
const validator = require('validator');
const jwt = require("jsonwebtoken")
// Schema = Structure of a Document

// A collection in MongoDB is like a table in SQL databases, but it stores documents instead of rows.

// 🔹 Database → Contains multiple collections
// 🔹 Collection → Contains multiple documents
// 🔹 Document → Stores data in JSON-like format

// Model = Interface to Work with Documents.

// A Model in Mongoose is like a bridge between your application and the MongoDB collection. It allows you to create, read, 
// update, and delete (CRUD) documents in a specific collection.

const userSchema =  mongoose.Schema(
    {
    firstName: {
        type: String,
        minLength : 4 
    }
    ,
    lastName:{
        type: String
    },
    age:{
        type: Number,
        min: 12,
        max : 21
    },
    gender:{
        type: String,
        validate(value){
            if(!["male" , "female" , "other"].includes(value)){
                  throw new Error("gender is incorrect")
            }
        }
        // so now  validate function does not work in case of updation .it will only validate when we create a new user.
    },
    emailId: {
        type: String,
        required: true,
        unique : true,
        lowercase : true,
        trim : true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("error found")
            }
        }
    },
    password: {
        type : String,
        required : true
    },
    about : {
        type : String,
        default : "this is a default discription of user",
    },
    skills : {
        type : [String]
    }
},
{
    timestamps : true,
}
)

userSchema.methods.getJWT = async function () {

    const user = this;

    const token = await jwt.sign({_id : user._id} , "devTinder@123" , {expiresIn: "1d"});
    return token;
}

module.exports = mongoose.model("User", userSchema); // modelName , schema
// "User" → Model name (Mongoose automatically creates "users" collection)
