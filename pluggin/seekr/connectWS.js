import {
    handler
} from './handler';

// establishing a ws connctn
const WebSocket = require('ws');
let ws;


function connectWebSocket() {
    ws = new WebSocket(process.env.WEB_SOCKET);

    ws.on('open', () => {
        console.log('Connected to WebSocket server');
    });


    ws.on('message', function incoming(message) {
        let incomingData;
        try {
            incomingData = JSON.parse(message);
        } catch (err) {
            console.error('Invalid JSON:', err);
            return;
        }
        handler(incomingData);

    })


    ws.on('close', () => {
        console.log('WebSocket closed, retrying in 3s');
        setTimeout(() => connectWebSocket(), 3000);
    });
    ws.onerror = (e) => {
        console.warn("X--> Socket error", e);
    };

    return ws;
}

module.exports = {
    connectWebSocket
};