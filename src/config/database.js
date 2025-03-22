const mongoose = require("mongoose");
// connecting the application to the cluster
const connectDb = async () => {
     await mongoose.connect(
        "mongodb+srv://amaheshwari819:NamasteNode@namastenode.uey1a.mongodb.net/"
     )
}

connectDb()
.then(() => {
    console.log("database connected successfully")
})
.catch((err) => {
 console.error("database not connected ")
})
 