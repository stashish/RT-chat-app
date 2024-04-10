"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.memoryStore = void 0;
let globalChatId = 0;
class memoryStore {
    constructor() {
        this.store = new Map();
    }
    initRoom(roomId) {
        this.store.set(roomId, {
            roomId,
            chats: []
        });
    }
    getChats(roomId, limit, offset) {
        const room = this.store.get(roomId);
        if (!room) {
            return;
        }
        return room.chats.reverse().slice(0, offset).slice(-1 * limit);
    }
    addChats(userId, name, roomId, message) {
        const room = this.store.get(roomId);
        if (!room) {
            return null;
        }
        const chat = {
            id: (globalChatId++).toString(),
            userId,
            name,
            message,
            upVotes: [],
        };
        room.chats.push(chat);
        return chat;
    }
    upVoteMessage(userId, roomId, chatId) {
        const room = this.store.get(roomId);
        if (!room) {
            return;
        }
        const chat = room.chats.find(({ id }) => id === chatId);
        if (chat) {
            chat.upVotes.push(userId);
        }
        return chat;
    }
}
exports.memoryStore = memoryStore;
