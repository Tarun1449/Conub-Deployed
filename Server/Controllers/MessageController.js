
const Message = require('../Models/Messages');

exports.getMessages = async (req, res) => {
    try {
        const { email } = req.user; // Assuming req.user contains the logged-in user's email
        const { recipientId, page , pageSize = 20 } = req.body; // Default page and pageSize values
        
        console.log(page)
        const messages = await Message
            .find({
                $or: [
                    { senderId: email, recipientId: recipientId },
                    { senderId: recipientId, recipientId: email }
                ]
            })
            .sort({ timestamp: -1 }) // Sort by timestamp in descending order (latest first)
            .skip((page - 1) * pageSize) // Skip records based on page number
            .limit(pageSize); // Limit number of records per page
            
        return res.status(200).json({ messages:messages.reverse() });
        
    } catch (error) {
        console.error("Error fetching messages:", error);
        return res.status(500).json({ error: "Failed to fetch messages" });
    }
};
