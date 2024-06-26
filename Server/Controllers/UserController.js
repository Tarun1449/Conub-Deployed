const User = require("../Models/User");

exports.search = async (req, res) => {
    const query = req.body.query;
    
    try {
        // Search users in the database based on the query
        const users = await User.find(
            { email: { $regex: query, $options: 'i' } }, // Case-insensitive regex search for email
            { email: 1 } // Projection to include only the 'email' field
        );
        
        // Extracting only the userEmail from each user object
        const userEmails = users.map(user => user.email);
        
        res.json(userEmails);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.addFriend = async (req, res) => {
    const { item } = req.body;
    const email = req.user.email;
    if(email == item){
        return res.status(500).json({ message: 'U cannot add yourself as friend' });
    }
    try {
        // Check if the friend already exists in the user's Friends array
        const existingUser = await User.findOne({ email });
        const existingUser2 = await User.findOne({email:item});

        if (existingUser && existingUser2) {
            // Check if the friend already exists in the Friends array
            if (existingUser.Friends.includes(item)) {
                return res.status(400).json({ message: 'Already a friend' });
            }

            // If friend does not exist, add it to the Friends array
            existingUser.Friends.push(item);
            existingUser2.Friends.push(email);
            // Save the updated user object
            await existingUser.save();
            await existingUser2.save();
            res.status(200).json({ message: 'Friend added successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};
exports.getFriends = async(req,res)=>{
    const email = req.user.email;
    
    try{
        const existingUser =  await User.findOne({email});
        if(existingUser){
            return res.json({friends:existingUser.Friends}).status(200);
        }
    }catch(error){
        return res.status(400);
    }
}