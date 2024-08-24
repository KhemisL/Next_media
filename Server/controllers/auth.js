import bcrycpt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js"

// Register controllers
export const register = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation
        } = req.body;

        const salt = await bcrycpt.genSalt();
        const passwordHash = await bcrycpt.hash(password, salt);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viwedProfile: Math.floor(Math.random()* 10000),
            impressions: Math.floor(Math.random()* 10000)
        })

        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

// Login controllers
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email});

        if(!user) return  res.status(400).json({msg: "User does not exist"});

        const isMatch = await bcrycpt.compare(password, user.password);
        if(!isMatch) return  res.status(400).json({msg: "Invalid credentials"});

        const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET);

        delete user.password;
        res.status(201).json({token, user});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}