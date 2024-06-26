const User = require("../Models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const jwtKey = process.env.jwtKey;


exports.signUp = async(req,res)=>{
    try {
        
        const { formData } = req.body;  
        if ( formData.username=='' || formData.email=='' || formData.password=='') {
            return res.status(400).json({ message: "Fill the Credentials" });
        }
        const existingUser = await User.findOne({ email:formData.email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(formData.password, saltRounds);

        // Create a new user with the hashed password
        const newUser = new User({ email:formData.email, username:formData.username, password: hashedPassword });
        await newUser.save();   
        return res.status(200).json({ message: "User created successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({ message: "User not found" });
        }

        const passwordMatch = await bcrypt.compare(password, existingUser.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = jwt.sign(
            { email: existingUser.email },
            jwtKey,
            { expiresIn: '1h' }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            maxAge:3600 * 1000,
            sameSite:"Strict",
        });

        // Send the token back as a response
        return res.status(200).json({ message: "Login Successful"});
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
exports.verifyToken = async(req,res)=>{
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Token not provided" });
        }
        const decoded = jwt.verify(token, jwtKey);
        const email = decoded.email;
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).send('User not found');
        }
        return res.status(200).json({message:"User Verified",user});
    } catch (error) {
        console.error("Token verification error:", error);
        return res.status(403).json({ message: "Invalid token" });
    }

}
exports.logout = async (req, res) => {
    console.log("working");
    res.clearCookie('token').sendStatus(200);
};