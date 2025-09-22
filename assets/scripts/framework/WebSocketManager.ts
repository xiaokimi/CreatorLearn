import { eventMgr } from "./EventManager";

export class WebSocketManager {
    private static _instance: WebSocketManager | null = null;

    private _url: string = "";
    private _websocket: WebSocket | null = null;

    private _reconnectTotal: number = 3;
    private _reconnectCount: number = 0;
    private _reconnectInterval: number = 2;

    private constructor() {}

    public static getInstance(): WebSocketManager {
        if (!WebSocketManager._instance) {
            WebSocketManager._instance = new WebSocketManager();
        }
        return WebSocketManager._instance;
    }

    public connect(url: string): void {
        if (this._websocket) {
            if (this._websocket.readyState === WebSocket.CONNECTING) {
                console.error("Connecting server ...");
                return;
            } else if (this._websocket.readyState === WebSocket.OPEN) {
                console.error("Server is connected.");
                return;
            }
        }

        this._url = url;
        this._websocket = new WebSocket(url);
        this._websocket.onopen = this.onOpen.bind(this);
        this._websocket.onerror = this.onError.bind(this);
        this._websocket.onmessage = this.onMessage.bind(this);
        this._websocket.onclose = this.onClose.bind(this);
    }

    public disconnect(): void {
        this.clearEvent();

        if (this._websocket) {
            this._websocket.close();
            this._websocket = null;
        }
    }

    public sendMessage(message: string): void {
        if (this._websocket && this._websocket.readyState === WebSocket.OPEN) {
            
        }
    }

    private onOpen(event: Event): void {
        this._reconnectCount = 0;
        eventMgr.emit("SocketState", "OnOpen");
    }

    private onError(event: Event): void {
        eventMgr.emit("SocketState", `OnError ${event}`);
    }

    private onMessage(message: MessageEvent): void {

    }

    private onClose(event: CloseEvent): void {
        console.log(`${event.code}: ${event.reason}`);
        //this.reconnect();
        eventMgr.emit("SocketState", `OnClose ${event.code}: ${event.reason}`);
    }

    private reconnect(): void {
        if (this._reconnectCount >= this._reconnectTotal) {
            return;
        }

        this._reconnectCount++;
        this.clearEvent();

        // 间隔时间重连
        setTimeout(() => {
            this.connect(this._url);
        }, this._reconnectInterval * 1000);
    }

    private clearEvent(): void {
        if (this._websocket) {
            this._websocket.onopen = null;
            this._websocket.onerror = null;
            this._websocket.onmessage = null;
            this._websocket.onclose = null;
        }
    }
}

export const webSocketMgr = WebSocketManager.getInstance();
