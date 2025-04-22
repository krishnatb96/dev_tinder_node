const express = require('express');
const connectDB = require('./config/database');
const port = 8000
const app = express();
const User = require('./models/user');
app.use(express.json());

// signup route

app.post('/signup', async (req, res) => {

    const userObject = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        age: req.body.age,
        password: req.body.password,
        gender:req.body.gender,
    }

    const user = new User(userObject);
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        await user.save();
        res.status(200).json({ message: 'User created successfully', id: user._id }); 
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})

// login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const userDetails = await User.findOne({ email: email });
    if (!userDetails) {
        return res.status(400).json({ message: 'User not found' });
    }
    if (userDetails.password !== password) {
        return res.status(400).json({ message: 'Invalid password' });
    }
    res.status(200).json({ message: 'Login successful', id: userDetails._id });
})

// get user by email Id

app.get('/user',async (req, res) => {

    const userEmail = req.query.email;

    try {
        const user = await User.findOne({ email: userEmail });
        if(!user){
          return  res.status(400).json({ message: 'User not found' });
        }
       return res.status(200).json({ message: 'User found', userList: user });
    } catch (error) {
      return  res.status(400).json({message:"something went wrong"})
    }

})

// Feed API get all users from database 

app.get('/feed', async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json({ message: 'Users found', userList: users });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
)

// get user by id

app.get('/userById',async(req,res)=>{
 
     const userById = req.query.id 
    try {
        const user = await User.findById(userById);
        console.log(user);
        if(!user){
           return res.status(400).json({message:'User not found'})
        }
       res.status(200).json({message:'User found',user:user})

    } catch (error) {
        res.status(400).json({message:'Something went wrong'})
    }

})

// update user by id

app.patch('/user', async (req, res) => {
    const userId = req.body.userId;
    const data = req.body;
    try {
        const user = await User.findByIdAndUpdate({_id: userId}, data, { new: true, runValidators: true });
        console.log(user);
        res.send('user updated successfully')
        
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
})

// delete route

app.delete('/delete', async (req, res) => {
    const userId = req.query.id;
    try {
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})
// update route

app.put('/update/:id', async (req, res) => {})

connectDB()
    .then(() => {
        console.log('MongoDB connected...')
        app.listen(`${port}`,()=>{
            console.log(`server is running on ${port}`);
         })
    })
    .catch(err => console.log(err));

