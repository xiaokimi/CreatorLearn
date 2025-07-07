import { _decorator, Component, Graphics, math, Node, tween, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('WaterTilt')
export class WaterTilt extends Component {

    private _bottleWidth: number = 200;
    private _bottleHeight: number = 200;
    private _bottlePos: Vec2 = new Vec2(-100, -100);

    private _graphics: Graphics | null = null;
    private _maxRandians: number = 0;

    @property
    waterHeight: number = 0;

    @property
    waterAngle: number = 0;

    @property
    waterColor: math.Color = math.Color.WHITE;

    protected onLoad(): void {
        // 临界角度
        this._maxRandians = Math.atan(Math.min(2 * this.waterHeight, this._bottleHeight) / this._bottleWidth);

        this._graphics = this.getComponent(Graphics);
        this.drawWater();
        this.node.angle = this.waterAngle;

        tween(this.node)
            .to(10, { angle: 80 }, {
                onUpdate: (target) => {
                    this.waterAngle = target.angle;
                    this.drawWater();
                }
            })
            .to(20, { angle: -80}, {
                onUpdate: (target) => {
                    this.waterAngle = target.angle;
                    this.drawWater();
                }
            })
            .start();
    }

    private drawWater(): void {
        if (!this._graphics) {
            return;
        }

        const randians = this.waterAngle / 180 * Math.PI;
        const delta = this._bottleWidth * Math.tan(randians);

        this._graphics.clear();
        // 先画杯子的区域
        const lineWidth = 10;
        this._graphics.moveTo(this._bottlePos.x - lineWidth / 2, this._bottlePos.y + this._bottleHeight);
        this._graphics.lineTo(this._bottlePos.x - lineWidth / 2, this._bottlePos.y - lineWidth / 2);
        this._graphics.lineTo(this._bottlePos.x + this._bottleWidth + lineWidth / 2, this._bottlePos.y - lineWidth / 2);
        this._graphics.lineTo(this._bottlePos.x + this._bottleWidth + lineWidth / 2, this._bottlePos.y + this._bottleHeight);
        this._graphics.strokeColor = math.Color.YELLOW;
        this._graphics.lineWidth = lineWidth;
        this._graphics.stroke();

        // 梯形还是三角形
        if (randians >= this._maxRandians || randians <= -this._maxRandians) {
            const height = Math.min(Math.sqrt(2 * this.waterHeight * Math.abs(delta)), this._bottleHeight);
            const width = height / Math.abs(Math.tan(randians));

            if (randians >= 0) {
                this._graphics.moveTo(this._bottlePos.x, this._bottlePos.y);
                this._graphics.lineTo(this._bottlePos.x + width, this._bottlePos.y);
                this._graphics.lineTo(this._bottlePos.x, this._bottlePos.y + height);
            } else {
                this._graphics.moveTo(this._bottlePos.x + this._bottleWidth - width, this._bottlePos.y);
                this._graphics.lineTo(this._bottlePos.x + this._bottleWidth, this._bottlePos.y);
                this._graphics.lineTo(this._bottlePos.x + this._bottleWidth, this._bottlePos.y + height);
            }
        } else {
            // 超过瓶子高度后，就不用计算面积了，保持水面持平
            let leftHeight = this.waterHeight + delta / 2;
            let rightHeight = this.waterHeight - delta / 2;

            if (leftHeight >= this._bottleHeight) {
                leftHeight = this._bottleHeight;
                rightHeight = this._bottleHeight - delta;
            } else if (rightHeight >= this._bottleHeight) {
                rightHeight = this._bottleHeight;
                leftHeight = this._bottleHeight + delta;
            }

            this._graphics.moveTo(this._bottlePos.x, this._bottlePos.y);
            this._graphics.lineTo(this._bottlePos.x + this._bottleWidth, this._bottlePos.y);
            this._graphics.lineTo(this._bottlePos.x + this._bottleWidth, this._bottlePos.y + rightHeight);
            this._graphics.lineTo(this._bottlePos.x , this._bottlePos.y + leftHeight);
        }

        this._graphics.fillColor = this.waterColor;
        this._graphics.fill();
    }
}


