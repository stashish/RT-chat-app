import z from 'zod';

export enum SupportedMessage {
    JoinRoom = 'JOIN_ROOM',
    SendMessage = 'SEND_MESSAGE',
    UpvoteMessage = 'UPVOTE_MESSAGE'
}

export type IncomingMessage = {
    type: SupportedMessage.JoinRoom,
    payload: InitMessageType
} | {
    type: SupportedMessage.SendMessage,
    payload: UserMessageType
} | {
    type: SupportedMessage.UpvoteMessage,
    payload: upVoteMessageType
};

export const InitMessage = z.object({
    name: z.string(),
    userId: z.string(),
    roomId: z.string(),
});


export type InitMessageType = z.infer<typeof InitMessage>

export const UserMessage = z.object({
    userId: z.string(),
    roomId: z.string(),
    message: z.string()
});

export type UserMessageType = z.infer<typeof UserMessage>

export const UpVoteMessage = z.object({
    userId: z.string(),
    roomId: z.string(),
    chatId: z.string()
});


export type upVoteMessageType = z.infer<typeof UpVoteMessage>