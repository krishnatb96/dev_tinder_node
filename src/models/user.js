const mongoose = require('mongoose');
 
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        minLength: 2,
    },  
    lastName: {
        type: String, 
        required: true,
        trim: true, 
        minLength: 2,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    age: {
        type: Number,
    },
    gender: {
        type: String,
        validate(values){
        if(!['male','female','other'].includes(values)){
            throw new Error("Not Valid Gender");
            
        }
      }
    },
    skills: {
        type: [String],
        default: [],
    },
    hobbies: {
        type: [String],
        default: [],
    },
})

const User = mongoose.model('User', userSchema);
module.exports = User;