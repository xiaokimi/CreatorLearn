import { _decorator, Component, EventTouch, Graphics, Node, UITransform, Vec2, Vec3 } from 'cc';
import { autoBindNode, initBindings } from '../framework/NodeDecorator';
const { ccclass, property } = _decorator;

@ccclass('Eraser')
export class Eraser extends Component {
    @property
    lineWidth: number = 20;

    @autoBindNode(UITransform)
    private _transform: UITransform | null = null;

    @autoBindNode(Graphics)
    private _graphics: Graphics | null = null;

    private _lastPos: Vec2 = new Vec2(0, 0);

    @initBindings
    protected onLoad(): void {
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);

        this._graphics.clear();
        this._graphics.fill();
    }

    protected onDestroy(): void {
        this.node.targetOff(this);
    }

    protected onTouchStart(event: EventTouch): void {
        const worldPos = event.getUILocation();
        const nodePos = this._transform.convertToNodeSpaceAR(new Vec3(worldPos.x, worldPos.y, 0));

        this.drawCircle(nodePos.x, nodePos.y);
    }

    protected onTouchMove(event: EventTouch): void {
        const worldPos = event.getUILocation();
        const nodePos = this._transform.convertToNodeSpaceAR(new Vec3(worldPos.x, worldPos.y, 0));

        this.drawPath(nodePos.x, nodePos.y);
    }

    protected onTouchEnd(event: EventTouch): void {

    }

    protected onTouchCancel(event: EventTouch): void {

    }

    private drawCircle(x: number, y: number): void {
        this._graphics.circle(x, y, this.lineWidth);
        this._graphics.fill();

        this._lastPos.x = x;
        this._lastPos.y = y;
    }

    private drawPath(x: number, y: number): void {
        const dir: Vec2 = new Vec2(x - this._lastPos.x, y - this._lastPos.y);
        dir.normalize();

        const p0 = new Vec2(this._lastPos.x - dir.y * this.lineWidth, this._lastPos.y + dir.x * this.lineWidth);
        const p1 = new Vec2(x - dir.y * this.lineWidth, y + dir.x * this.lineWidth);
        const p2 = new Vec2(x + dir.y * this.lineWidth, y - dir.x * this.lineWidth);
        const p3 = new Vec2(this._lastPos.x + dir.y * this.lineWidth, this._lastPos.y - dir.x * this.lineWidth)

        this._graphics.moveTo(p0.x, p0.y);
        this._graphics.lineTo(p1.x, p1.y);
        this._graphics.lineTo(p2.x, p2.y);
        this._graphics.lineTo(p3.x, p3.y);
        this._graphics.stroke();
        this._graphics.fill();

        this.drawCircle(x, y);
    }
}
