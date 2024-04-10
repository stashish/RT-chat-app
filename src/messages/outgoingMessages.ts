export enum SupportedMessage {
    AddChat = 'ADD_CHAT',
    UpdateChat = 'UPDATE_CHAT'
}

type messagePayload = {
    roomId: string,
    message: string,
    name: string,
    upvotes: number,
    chatId: string,
}

export type OutgoingMessage = {
    type: SupportedMessage.AddChat,
    payload: messagePayload
} | {
    type: SupportedMessage.UpdateChat,
    payload: Partial<messagePayload>
}