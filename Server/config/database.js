const mongoose = require('mongoose');

const MongoUrl = process.env.MONGOURL
async function dbConnect  ()  {
    
    try {
        await mongoose.connect(MongoUrl);
        console.log("Mongoose Connected")
        
    } catch (error) {
        console.log("Failed to Connect:", error);
    }
}

module.exports = dbConnect;
