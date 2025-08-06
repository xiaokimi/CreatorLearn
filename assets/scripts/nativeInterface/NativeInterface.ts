import { _decorator, Button, Component, native, Node, UITransform, WebView } from 'cc';
import { native_sum, native_getVersionName } from '../framework/native/NativeBridge';
import { autoBindNode, initBindings } from '../framework/NodeDecorator';
import { NATIVE } from 'cc/env';
const { ccclass, property } = _decorator;

@ccclass('NativeInterface')
export class NativeInterface extends Component {
    @autoBindNode("WebView_game", WebView)
    private _webView: WebView | null = null;

    @autoBindNode("Button", Button)
    private _button: Button | null = null;

    @initBindings
    protected onLoad(): void {
        if (NATIVE) {
            this._webView.setJavascriptInterfaceScheme("lua");
            this._webView.setOnJSCallback(this.onJSCallback.bind(this));
        } else {
            window.addEventListener("message", this.handleWebMessage.bind(this));
        }

        this._button.node.on(Button.EventType.CLICK, this.onButtonClick, this);
        this._webView.node.active = false;
    }

    protected onDestroy(): void {
        this._button.node.off(Button.EventType.CLICK, this.onButtonClick, this);

        if (NATIVE) {
            this._webView.setOnJSCallback(() => {});
        } else {
            window.removeEventListener("message", this.handleWebMessage.bind(this));
        }
    }

    private handleWebMessage(event: MessageEvent): void {
        if (event.data.command === "closeGame") {
            this._webView.node.active = false;
        }
    }

    private onButtonClick(): void {
        this._webView.node.active = true;
        this._webView.url = "http://192.168.3.125:5678/home?showBack=true";
    }

    private onJSCallback(webView: WebView, url: string): void {
        if (url === "lua://closegame/helper") {
            this._webView.node.active = false;
        }
    }
}
