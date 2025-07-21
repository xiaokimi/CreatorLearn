import { _decorator, Component, Label, tween, Vec2, Vec3 } from 'cc';
import { autoBindNode, initBindings } from '../framework/NodeDecorator';
const { ccclass } = _decorator;

@ccclass('SlotSample')
export class SlotSample extends Component {
    private _num: number = 0;
    
    @autoBindNode("Label_1", Label)
    private _label_1: Label | null = null;

    @autoBindNode("Label_2", Label)
    private _label_2: Label | null = null;
    
    @initBindings
    protected onLoad(): void {
        this.initAnim();
    }

    private initAnim(): void {
        this._label_1.string = this._num.toString();
        this._label_1.node.y = 0;

        this.playFirstAnim();
    }

    private playFirstAnim(): void {
        this._num = (this._num + 1) % 10;
        this._label_2.string = this._num.toString();
        this._label_2.node.y = -53;

        tween(this._label_1.node)
            .to(1, new Vec3(0, 53, 0))
            .call(() => {
                this.playSecondAnim();
            })
            .start();

        tween(this._label_2.node)
            .to(1, Vec3.ZERO)
            .start();
    }

    private playSecondAnim(): void {
        this._num = (this._num + 1) % 10;
        this._label_1.string = this._num.toString();
        this._label_1.node.y = -53;

        tween(this._label_2.node)
            .to(1, new Vec3(0, 53, 0))
            .call(() => {
                this.playFirstAnim();
            })
            .start();

        tween(this._label_1.node)
            .to(1, Vec3.ZERO)
            .start();
    }
}


