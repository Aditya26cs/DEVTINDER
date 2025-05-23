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

const isValidPassword =  (password) => {
   return validator.isStrongPassword(password, {
     minLength: 8,
     minUppercase: 1,
     minNumbers: 1,
     minSymbols: 1,
   })
}

module.exports = {
    validateSignupData,validationEditProfileData , isValidPassword
};