require('dotenv').config();
const express = require('express');
const app = express();
const dbConnect = require('./config/database');


const authRouter = require('./Routes/AuthRotes');
const userRouter = require('./Routes/UserRoutes');
const messageRoutes = require('./Routes/MessageRoutes');


const cookieParser = require('cookie-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const Message = require('./Models/Messages');



const jwtKey  = process.env.jwtKey;

const path = require('path');
const dir = path.dirname("");

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
    }
});

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ["GET", "POST"],
    credentials: true
}));

app.use(cookieParser());
app.use(bodyParser.json());

dbConnect(); // Establish database connection

app.use('/api/auth', authRouter);
app.use('/user', userRouter);
app.use('/messages',messageRoutes);


app.use(express.static(path.join(dir,"../client/build")));



io.use((socket, next) => {
    const cookieHeader = socket.handshake.headers.cookie;

    if (cookieHeader) {
        const token = extractTokenFromCookie(cookieHeader);

        if (token) {
            jwt.verify(token, jwtKey, (err, decoded) => {
                if (err) {
                    console.error('Authentication error: Invalid token');
                    next(new Error('Authentication error: Invalid token'));
                } else {
                    socket.decoded = decoded;
                    next();
                }
            });
        } else {
            console.error('Authentication error: Token not found');
            next(new Error('Authentication error: Token not found'));
        }
    } else {
        console.error('Authentication error: Cookie header not found');
        next(new Error('Authentication error: Cookie header not found'));
    }
});

function extractTokenFromCookie(cookieHeader) {
    const cookieParts = cookieHeader.split(';');
    for (let i = 0; i < cookieParts.length; i++) {
        const cookiePair = cookieParts[i].split('=');
        const cookieName = cookiePair[0].trim();
        const cookieValue = cookiePair[1];

        if (cookieName === 'token') {
            return cookieValue;
        }
    }
    return null;
}

const connectedUsers = new Map();

io.on('connection', (socket) => {
    socket.on('join', async(userId) => {
        try {
            const messagesToUpdate = await Message.find({
                recipientId: userId,
                status: { $ne: 'delivered' } // Only select messages that are not already delivered
            });
            await Promise.all(messagesToUpdate.map(async (message) => {
                message.status = 'delivered';
                await message.save();
            }));
            const senders = new Set(messagesToUpdate.map(message => message.senderId));
            senders.forEach(senderId => {
                const senderSocket = connectedUsers.get(senderId);
                if (senderSocket) {
                    io.to(senderSocket).emit('userConnected', userId);
                }
            });
            console.log(`User ${userId} joined`);
            connectedUsers.set(userId, socket.id); // Store socket ID in map
        } catch (error) {
            console.error('Error updating messages:', error);
        }
    });

    socket.on('chat message', async ( message ) => {
        const senderSocket = connectedUsers.get(socket.decoded.email);
        const recipientSocket = connectedUsers.get(message.recipientId);
        const userMessage = new Message({
            content: message.content,
            senderId: socket.decoded.email,
            recipientId: message.recipientId,
            status: 'sent',
            timestamp: new Date()
        });

        await userMessage.save();
        if (recipientSocket) {
            io.to(recipientSocket).emit('chat message', userMessage);

            // Update the message status to 'delivered' in the database
            userMessage.status = 'delivered';
            await userMessage.save();
            
            // Emit 'Message-Status' event to sender socket with 'delivered' status
            io.to(senderSocket).emit('Message-delivered', userMessage);
            
        } else {
            io.to(senderSocket).emit('Message-sent', userMessage);
            console.log(`User ${message.recipientId} is not connected`);
        }
    });

    socket.on('disconnect', () => {
        connectedUsers.forEach((value, key) => {
            if (value === socket.id) {
                connectedUsers.delete(key);
                console.log(`User ${key} disconnected`);
            }
        });
    });

});


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

server.listen(process.env.PORT, () => {
    console.log(`Server Started on Port ${process.env.PORT}`);
});
