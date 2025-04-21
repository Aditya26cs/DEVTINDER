const mongoose = require("mongoose");

// Schema = Structure of a Document

// A collection in MongoDB is like a table in SQL databases, but it stores documents instead of rows.

// 🔹 Database → Contains multiple collections
// 🔹 Collection → Contains multiple documents
// 🔹 Document → Stores data in JSON-like format

// Model = Interface to Work with Documents.

// A Model in Mongoose is like a bridge between your application and the MongoDB collection. It allows you to create, read, 
// update, and delete (CRUD) documents in a specific collection.

const userSchema =  mongoose.Schema({
    firstName: {
        type: String
    }
    ,
    lastName:{
        type: String
    },
    age:{
        type: Number
    },
    gender:{
        type: String
    },
    emailId: {
        type: String
    },
    password: {
        type : String
    }
})

module.exports = mongoose.model("User", userSchema); // modelName , schema
// "User" → Model name (Mongoose automatically creates "users" collection)
