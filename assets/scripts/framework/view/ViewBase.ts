import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ViewBase')
export class ViewBase extends Component {
    protected _animDuration: number = 0.3;

    public showWithAnim(): void {
        this.showCompleted();
    }

    protected showCompleted(): void {

    }

    public hideWithAnim(): void {
        this.hideCompleted();
    }

    protected hideCompleted(): void {

    }
}
