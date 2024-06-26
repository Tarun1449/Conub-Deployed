const fs = require('fs');

// Generate 100 messages
const messages = [];
for (let i = 1; i <= 5000; i++) {
    if (i % 2 === 0) {
        // tarun@gmail.com is sender, anmol@gmail.com is recipient
        messages.push({
            content: `Message ${i} from tarun@gmail.com to anmol@gmail.com`,
            senderId: 'tarun@gmail.com',
            recipientId: 'anmol@gmail.com',
            status: 'sent',
            timestamp: new Date().toISOString()
        });
    } else {
        // anmol@gmail.com is sender, tarun@gmail.com is recipient
        messages.push({
            content: `Message ${i} from anmol@gmail.com to tarun@gmail.com`,
            senderId: 'anmol@gmail.com',
            recipientId: 'tarun@gmail.com',
            status: 'sent',
            timestamp: new Date().toISOString()
        });
    }
}

// Write messages to a JSON file
fs.writeFile('messages.json', JSON.stringify(messages, null, 2), (err) => {
    if (err) {
        console.error('Error writing messages to file:', err);
        return;
    }
    console.log('Messages generated and saved to messages.json');
});
