import { _decorator, Component, screen, view, sys } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ScreenAdapter')
export class ScreenAdapter extends Component {
    protected onLoad(): void {
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
}
