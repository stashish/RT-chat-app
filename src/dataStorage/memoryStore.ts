import { StoreChat, NewChat, userId } from "./store";
let globalChatId = 0;

export interface Room {
    roomId: string;
    chats: NewChat[];
}

export class memoryStore implements StoreChat {
    private  store: Map<string, Room>;
    constructor () {
        this.store = new Map<string, Room>();
    }

    initRoom(roomId: string) {
        this.store.set(roomId, {
            roomId,
            chats: []
        });
    }

    getChats(roomId: string, limit: number, offset: number) {
        const room = this.store.get(roomId);
        if(!room) {
            return
        }
        return room.chats.reverse().slice(0, offset).slice(-1 * limit);
    }

    addChats(userId: userId, name: string, roomId: string, message: string) {
        const room = this.store.get(roomId);
        if(!room) {
            return null
        }
        const chat = {
            id: (globalChatId++).toString(),
            userId,
            name,
            message,
            upVotes: [],
        }
        room.chats.push(chat)
        return chat;
    }

    upVoteMessage(userId: userId, roomId: string, chatId: string) {
        const room = this.store.get(roomId);
        if(!room) {
            return
        }

        const chat = room.chats.find(({id}) => id === chatId);
        if(chat) {
            chat.upVotes.push(userId);
        }
        return chat;
    }
}