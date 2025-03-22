const mongoose = require("mongoose");
// connecting the application to the cluster

const connectDb = async () => {
     await mongoose.connect(
        "mongodb+srv://amaheshwari819:NamasteNode@namastenode.uey1a.mongodb.net/devTinder"
     )
}

module.exports = connectDb;

 
 