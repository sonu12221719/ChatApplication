import User from '../models/UserModel.js';
import generateAuthToken from '../utils/generateAuthToken.js';
import bcrypt from 'bcryptjs';

//Register a new user
export const registerNewUser = async (req, res) => {
    const {name, email, password}=req.body;

    try {
        const user = await User.findOne({email});
        if (user) {
            return res.status(400).json({message: "User already exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password,salt);

        const newUser = new User({
            name,
            email,
            password: hashPassword
        });

        await newUser.save();
        res.status(201).json({message: "User registered successfully"});

    } catch (error) {
        res.status(500).json({message: "Server error", error: error.message});
    }
    
}

export const loginUser = async (req, res)=>{
    const {email, password} = req.body;

    try {
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message: "User not found"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message: "Invalid credentials"});
        }

        const token = generateAuthToken(user._id);
        res.status(200).json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            }
        });

    } catch (error) {
        res.status(500).json({message: "Server error", error: error.message});
    }
}

export const getUserByEmailOrName = async(req,res)=>{
    const {query} = req.query;

    try {
        const users = await User.find({
            $or:[
                {email: {$regex: query, $options:'i'}},
                {name: {$regex:query, $options:'i'}}
            ]
        }).select('-password');

        res.status(201).json(users);

    } catch (error) {
        console.log("Server Error: "+error);
        res.status(500).json({message:"Internal server error"});
    }
}

// controller/authController.js
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const logoutUser = async (req, res) =>{
    try {
        return res.status(200).json({message: "User logged out successfully"});
    } catch (error) {
        res.status(500).json({message: "Server error", error: error.message});
    }
}