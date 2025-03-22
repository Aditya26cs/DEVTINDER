// handle auth middleware for all get , post , ... request
const adminAuth = (req,res,next) => {
    console.log("authentication is checked")
    const token = "abc";
    const isAdminAuthorized = token == "abcd";

    if(!isAdminAuthorized) {
        res.status(401).send("unauthorized access");
    }
    else{
        next();
    }
}


const  userAuth = (req,res,next) => {
    console.log("authentication is checked")
    const token = "abc";
    const isAdminAuthorized = token == "abcd";

    if(!isAdminAuthorized) {
        res.status(401).send("unauthorized access");
    }
    else{
        next();
    }
}
module.exports= {
    adminAuth ,
    userAuth
}