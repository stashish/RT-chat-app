export type userId = string

export interface NewChat {
    id: string
    userId: userId;
    name: string;
    message: string;
    upVotes: userId[];
}

export class StoreChat {
    constructor () {

    }

    initRoom(roomId: string) {

    }

    getChats(room: string, limit: number, offset: number) {

    }

    addChats(userId: userId, name: string, room: string, message: string) {

    }

    upVoteMessage(userId: userId, roomId: string, chatId: string) {

    }
}