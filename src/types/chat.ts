export interface Message {
    id: number;
    text: string;
    timestamp: Date;
    sent: boolean;
    file?: {
        name: string;
        url: string;
        type: string;
    };
}

export interface Chat {
    id: number;
    name: string;
    avatar: string;
    status: string;
    lastMessage: string;
    unread: number;
    messages: Message[];
} 