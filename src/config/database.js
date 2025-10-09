const mongoose = require("mongoose");
const MONGO_URI = "mongodb+srv://amaheshwari819:NamasteNode@namastenode.uey1a.mongodb.net/devTinder";

// connecting the application to the cluster

const connectDb = async () => {
     await mongoose.connect(MONGO_URI)
}

module.exports = connectDb;

 
 