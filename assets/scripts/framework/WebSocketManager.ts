export class WebSocketManager {
    private static _instance: WebSocketManager | null = null;
    private _url: string = "";
    private _websocket: WebSocket | null = null;

    private constructor() {}

    public static getInstance(): WebSocketManager {
        if (!WebSocketManager._instance) {
            WebSocketManager._instance = new WebSocketManager();
        }
        return WebSocketManager._instance;
    }

    public connect(url: string): void {
        this._url = url;
        this._websocket = new WebSocket(url);
        this._websocket.onopen = this.onOpen.bind(this);
        this._websocket.onerror = this.onError.bind(this);
        this._websocket.onmessage = this.onMessage.bind(this);
        this._websocket.onclose = this.onClose.bind(this);
    }

    public sendMessage(message: string): void {
        if (this._websocket && this._websocket.readyState === WebSocket.OPEN) {
            
        }
    }

    private onOpen(event: Event): void {

    }

    private onError(event: Event): void {

    }

    private onMessage(message: MessageEvent): void {

    }

    private onClose(event: CloseEvent): void {

    }
}
