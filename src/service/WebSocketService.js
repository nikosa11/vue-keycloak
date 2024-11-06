export class WebSocketService {
    constructor() {
        this.socket = null;
        this.handlers = new Map();
    }

    connect() {
        this.socket = new WebSocket(process.env.VUE_APP_WS_URL);
        
        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const handler = this.handlers.get(data.type);
            if (handler) {
                handler(data.payload);
            }
        };
    }

    on(type, handler) {
        this.handlers.set(type, handler);
    }

    send(type, payload) {
        if (this.socket?.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({ type, payload }));
        }
    }
} 