import { _decorator, Component, screen, view, sys, Button, Label } from 'cc';
import { eventMgr } from '../framework/EventManager';
import { autoBindNode, initBindings } from '../framework/NodeDecorator';
import { webSocketMgr } from '../framework/WebSocketManager';
const { ccclass, property } = _decorator;

@ccclass('ScreenAdapter')
export class ScreenAdapter extends Component {
    @autoBindNode("Button_connect", Button)
    private _buttonConnect: Button | null = null;

    @autoBindNode("Button_disconnect", Button)
    private _buttonDisconnect: Button | null = null;

    @autoBindNode("Label", Label)
    private _lable: Label | null = null;

    @initBindings
    protected onLoad(): void {
        this._buttonConnect.node.on(Button.EventType.CLICK, this.connect, this);
        this._buttonDisconnect.node.on(Button.EventType.CLICK, this.disconnect, this);
        eventMgr.on("SocketState", this.onSocketState, this);

        // 设计分辨率下的可视区域
        const visibleSize = view.getVisibleSize();
        console.log(`可视区域尺寸: ${visibleSize.width} * ${visibleSize.height}`);

        // 物理设备分辨率
        const frameSize = screen.windowSize;
        console.log(`物理设备分辨率: ${frameSize.width} * ${frameSize.height}`);

        // 设计分辨率
        const designSize = view.getDesignResolutionSize();
        console.log(`设计分辨率: ${designSize.width} * ${designSize.height}`);

        // DPI
        const scaleX = view.getScaleX();
        const scaleY = view.getScaleY();
        console.log(`缩放因子: ${scaleX} - ${scaleY}`);

        // 安全区
        const rect = sys.getSafeAreaRect();
        console.log(`安全区大小: ${rect.width} * ${rect.height}`);
    }

    protected onDestroy(): void {
        this._buttonConnect.node.off(Button.EventType.CLICK, this.connect, this);
        this._buttonDisconnect.node.off(Button.EventType.CLICK, this.disconnect, this);
        eventMgr.off("SocketState", this.onSocketState, this);
    }

    private connect(): void {
        let token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsb2dpblR5cGUiOiJJTSIsImxvZ2luSWQiOiIxNjZkNzFjNjBkMDQzYWMzMmQ2YTA1NTJhZWU2ODVkNiIsInJuU3RyIjoiZEFDalpOUGZha1cxcUQwYkNMcUNGS2xjTmJGRDl4T2MifQ.h3g0A20PUi0fv_tzvjrPEyJKD0hPOoXGSvHG7oCtJkA";

        webSocketMgr.connect(`ws://121.41.22.178:1999/bcoin/im/chat?Authorization=Bearer ${encodeURIComponent(token)}`);
    }

    private disconnect(): void {
        webSocketMgr.disconnect();
    }

    private onSocketState(desc: string): void {
        this._lable.string = desc;
    }
}
