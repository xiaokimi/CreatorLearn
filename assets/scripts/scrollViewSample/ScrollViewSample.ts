import { _decorator, Component, director, EventTouch, Label, NodeEventType, Rect, Size, sys, UITransform, Vec2, Vec3, view, screen, Enum, ScrollView } from 'cc';
import { off } from 'process';
const { ccclass, property, requireComponent } = _decorator;

interface TouchMoveData {
    displacement: Vec2;
    timestamp: number;
}

enum Direction {
    HORIZONTAL = 0,
    VERTICAL = 1
}

@ccclass('ScrollViewSample')
export class ScrollViewSample extends Component {
    private _worldBoundingBox: Rect = new Rect();

    private _curOffset: number = 0;
    private _minOffset: number = 0;
    private _maxOffset: number = 0;

    private _bounceTime: number = 1.0;
    private _bounceOffset: number = 0;
    private _bounceFactor: number = 20;

    private _preTouchPos: Vec2 = new Vec2(0, 0);
    private _preTimestamp: number = 0;
    private _touchMoveDatas: TouchMoveData[] = [];

    private _autoScrolling: boolean = false;
    private _autoScrollAccumulatedTime: number = 0;
    private _autoScrollTotalTime: number = 0;
    private _autoScrollStartOffset: number = 0;
    private _autoScrollTotalOffset: number = 0;

    @property({type: Enum(Direction)})
    direction: Direction = Direction.VERTICAL;

    @property
    contentSize: Size = new Size(0, 0);

    protected onLoad(): void {
        this.initTransformInfo();

        this.node.on(NodeEventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(NodeEventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(NodeEventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(NodeEventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }

    protected onDestroy(): void {
        this.node.targetOff(this);
    }

    protected update(dt: number): void {
        if (!this._autoScrolling) {
            return;
        }

        this._autoScrollAccumulatedTime += dt;
        if (this._autoScrollAccumulatedTime >= this._autoScrollTotalTime) {
            const targetOffset = this._autoScrollStartOffset + this._autoScrollTotalOffset;
            this.updateChildLocation(targetOffset - this._curOffset);

            if (targetOffset < this._minOffset) {
                this.startAutoScrolling(this._bounceOffset, this._bounceTime);
            } else if (targetOffset > this._maxOffset) {
                this.startAutoScrolling(-this._bounceOffset, this._bounceTime);
            } else {
                this._autoScrolling = false;
            }
        } else {
            if (this._curOffset < this._minOffset || this._curOffset > this._maxOffset) {
                this._autoScrollAccumulatedTime += dt * this._bounceFactor;
            }

            let percent = Math.min(1, this._autoScrollAccumulatedTime / this._autoScrollTotalTime);
            percent = this.quintEaseOut(percent);

            const percentOffset = this._autoScrollTotalOffset * percent;
            const offset = this._autoScrollStartOffset + percentOffset - this._curOffset;

            this.updateChildLocation(offset);
        }
    }

    protected initTransformInfo(): void {
        const transform = this.node.getComponent(UITransform);
        const size = transform.contentSize;
        const anchor = transform.anchorPoint;

        // 锚点确定了子节点的起始位置
        const x = -size.width * anchor.x;
        const y = -size.height * anchor.y;
        const worldPos = transform.convertToWorldSpaceAR(new Vec3(x, y, 0));
        this._worldBoundingBox = new Rect(worldPos.x, worldPos.y, size.width, size.height);

        this._curOffset = 0;
        this._minOffset = 0;
        this._maxOffset = this.contentSize.height - size.height;
        this._bounceOffset = size.height * 0.25;
    }

    protected onTouchStart(event: EventTouch): void {
        this._preTouchPos = event.getUILocation();

        this._autoScrolling = false;
        this._preTimestamp = Date.now();
        this._touchMoveDatas.length = 0;
    }

    protected onTouchMove(event: EventTouch): void {
        const prePos = this._preTouchPos;
        const preTimestamp = this._preTimestamp;

        const curPos = event.getUILocation();
        const curTimestamp = Date.now();

        this._preTouchPos = curPos;
        this._preTimestamp = curTimestamp;

        if (this._worldBoundingBox.contains(prePos) && this._worldBoundingBox.contains(curPos)) {
            const displacement = new Vec2(curPos.x - prePos.x, curPos.y - prePos.y);
            this.onMoveContent(displacement);

            this.saveTouchMoveData(displacement, curTimestamp - preTimestamp);
        }
    }

    protected onTouchEnd(event: EventTouch): void {
        if (!this.checkOutOfBoundary()) {
            const velocity = this.calculateTouchMoveVelocity();
            if (velocity.length() > 0) {
                const totalTime = Math.sqrt(Math.sqrt(velocity.length() / 5));

                const scrollFactor = 0.7;
                velocity.multiplyScalar(scrollFactor);
                const offset = this.direction === Direction.HORIZONTAL ? velocity.x : velocity.y;

                this.startAutoScrolling(offset, totalTime);
            }
        }
    }

    protected onTouchCancel(event: EventTouch): void {
        this.checkOutOfBoundary();
    }

    private onMoveContent(displacement: Vec2): void {
        const offset = this.direction === Direction.HORIZONTAL ? displacement.x : displacement.y;
        this.updateChildLocation(offset);
    }

    private updateChildLocation(offset: number): void {
        let totalOffset = this._curOffset + offset;
        totalOffset = this.ajustTargetOffset(totalOffset);
        const delta = totalOffset - this._curOffset;

        this._curOffset = totalOffset;
        const x = this.direction === Direction.HORIZONTAL ? delta : 0;
        const y = this.direction === Direction.VERTICAL ? delta : 0;

        this.node.children.forEach(child => {
            child.x += x;
            child.y += y;
        });
    }

    private calculateTouchMoveVelocity(): Vec2 {
        let totalTime = 0;
        let totalMovement = new Vec2(0, 0);
        this._touchMoveDatas.forEach(data => {
            totalTime += data.timestamp;
            totalMovement.add(data.displacement);
        })

        const maxTimeThreshold = 0.5;
        if (totalTime > 0 && totalTime < maxTimeThreshold) {
            totalMovement.divide2f(totalTime, totalTime);
            return totalMovement;
        }
        return Vec2.ZERO;
    }

    private startAutoScrolling(offset: number, totalTime: number): void {
        let totalOffset = this._curOffset + offset;
        totalOffset = this.ajustTargetOffset(totalOffset);

        this._autoScrollAccumulatedTime = 0;
        this._autoScrollTotalTime = totalTime;

        this._autoScrollStartOffset = this._curOffset;
        this._autoScrollTotalOffset = totalOffset - this._curOffset;

        this._autoScrolling = true;
    }

    private checkOutOfBoundary(): boolean {
        if (this._curOffset < this._minOffset) {
            const offset = this._minOffset - this._curOffset;
            this.startAutoScrolling(offset, this._bounceTime);
            return true;
        } else if (this._curOffset > this._maxOffset) {
            const offset = this._maxOffset - this._curOffset;
            this.startAutoScrolling(offset, this._bounceTime);
            return true;
        }
        return false;
    }

    private saveTouchMoveData(displacement: Vec2, timestamp: number): void {
        if (this._touchMoveDatas.length >= 5) {
            this._touchMoveDatas.shift();
        }

        this._touchMoveDatas.push({
            displacement: displacement,
            timestamp: timestamp / 1000
        });
    }

    private ajustTargetOffset(targetOffset: number): number {
        return Math.min(this._maxOffset + this._bounceOffset, Math.max(this._minOffset - this._bounceOffset, targetOffset));
    }

    private quintEaseOut(time: number): number {
        time -= 1;
        return time * time * time * time * time + 1;
    }
}
