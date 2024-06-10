import { connection, server } from 'websocket';
import http from 'http';
import { UserManager } from './UserManager';
import { IncomingMessage, SupportedMessage } from './messages/incomingMessages';
import { OutgoingMessage, SupportedMessage as OutgoingSupportedMessages } from './messages/outgoingMessages';
import { memoryStore } from './dataStorage/memoryStore';

const httpServer = http.createServer(function(request: any, response: any) {
    console.log((new Date()) + ' Received request for ' +  request.url);
    response.writeHead(404);
    response.end();
});

const userManager = new UserManager();
const Store = new memoryStore();

httpServer.listen(8080, function() {
    console.log((new Date()) + ' Server is listening on port 8080');
});

const wsServer = new server({
    httpServer: httpServer,
    autoAcceptConnections: false
});

function originIsAllowed(origin: string) {
  return true;
}

wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }
    
    var connection = request.accept(null, request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            try {
                messageHandler(connection, JSON.parse(message.utf8Data));
            } catch (e) {
                
            }
            // console.log('Received Message: ' + message.utf8Data);
            // connection.sendUTF(message.utf8Data);
        }
        // else if (message.type === 'binary') {
        //     console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
        //     connection.sendBytes(message.binaryData);
        // }
    });
    // connection.on('close', function(reasonCode, description) {
    //     console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    // });
});

function messageHandler(ws: connection, message: IncomingMessage) {
    console.log('incoming message' + JSON.stringify(message));
    if (message.type == SupportedMessage.JoinRoom) {
        const payload = message.payload
        userManager.addUser(payload.name, payload.userId, payload.roomId, ws);
    }
    
    if(message.type == SupportedMessage.SendMessage) {
        const payload = message.payload;
        const user = userManager.getUser(payload.roomId, payload.userId);
        if(!user) {
            console.error('User not found in db');
            return
        }
        let chat = Store.addChats(payload.userId, user.name, payload.roomId, payload.message);
        if (!chat) {
            return;
        }
        const outgoingPayload: OutgoingMessage = {
            type: OutgoingSupportedMessages.AddChat,
            payload : {
                chatId: chat.id,
                roomId: payload.roomId,
                message: payload.message,
                name: user.name,
                upvotes: 0
            }
        }
        userManager.broadCast(payload.roomId, payload.userId, outgoingPayload);
    }

    if(message.type === SupportedMessage.UpvoteMessage) {
        const payload = message.payload;
        const chat = Store.upVoteMessage(payload.userId, payload.roomId, payload.chatId);
        if (!chat) {
            return;
        }

        const outgoingPayload: OutgoingMessage = {
            type: OutgoingSupportedMessages.UpdateChat,
            payload : {
                chatId: payload.chatId,
                roomId: payload.roomId,
                upvotes: chat.upVotes.length,
            }
        }
        userManager.broadCast(payload.roomId, payload.userId, outgoingPayload);
    }

}