const validator = require("validator");

const validateSignupData = (req) => {

    const {firstName , lastName , emailId , password} = req.body;

    if(!firstName || !lastName){
         throw new Error("name is not valid")
    }

    else if(!validator.isEmail(emailId)){
        throw new Error("invalid email")
    }
    // else if(!validator.isStrongPassword(password)){
    //     throw new Error("make the password strong");
    // }
}; 

const validationEditProfileData = (req) => {
    const data = req.body;

    
    const Update_Allowed = ["about" , "gender" , "age" , "skills"];

    const isUpdateAllowed = Object.keys(data).every((k) => {
        return Update_Allowed.includes(k);
    })
     return isUpdateAllowed;
     
}

module.exports = {
    validateSignupData,validationEditProfileData
};