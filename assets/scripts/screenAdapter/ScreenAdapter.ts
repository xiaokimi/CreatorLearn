import { _decorator, Component, screen, view, sys, Button } from 'cc';
import { eventMgr } from '../framework/EventManager';
import { autoBindNode, initBindings } from '../framework/NodeDecorator';
const { ccclass, property } = _decorator;

@ccclass('ScreenAdapter')
export class ScreenAdapter extends Component {
    @autoBindNode("Button", Button)
    private _button: Button | null = null;

    @initBindings
    protected onLoad(): void {
        eventMgr.on("test", this.test, this);
        this._button.node.on(Button.EventType.CLICK, this.onButtonClick, this);

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
        eventMgr.off("test", this.test, this);
        this._button.node.off(Button.EventType.CLICK, this.onButtonClick, this);
    }

    private onButtonClick(): void {
        eventMgr.emit("test", 10);
    }

    private test(num: number): void {
        console.log(`------------- ${num}`);
    }
}
