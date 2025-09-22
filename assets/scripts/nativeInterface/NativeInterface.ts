import { _decorator, Button, Component, Director, director, game, ImageAsset, Size, Sprite, SpriteFrame, Texture2D, UITransform, WebView } from 'cc';
import { autoBindNode, initBindings } from '../framework/NodeDecorator';
import { read } from 'fs';
import { text } from 'stream/consumers';
const { ccclass, property } = _decorator;

@ccclass('NativeInterface')
export class NativeInterface extends Component {
    @autoBindNode("Sprite", Sprite)
    private _sprite: Sprite | null = null;

    @autoBindNode("Sprite", UITransform)
    private _spriteTransform: UITransform | null = null;

    @autoBindNode("Button", Button)
    private _button: Button | null = null;

    private _originSize: Size = new Size(0, 0);

    @initBindings
    protected onLoad(): void {
        this._button.node.on(Button.EventType.CLICK, this.onButtonClick, this);
        this._originSize.width = this._spriteTransform.width;
        this._originSize.height = this._spriteTransform.height;
    }

    protected onDestroy(): void {
        this._button.node.off(Button.EventType.CLICK, this.onButtonClick, this);
    }

    private onButtonClick(): void {
        director.once(Director.EVENT_AFTER_DRAW, this.capatureWindow.bind(this));
        //this.createHiddenInput();
    }

    private capatureWindow(): void {
        const canvas = game.canvas;
        const base64Date = canvas.toDataURL('image/png');
        this.loadSelectedImage(base64Date)

        console.log(`截屏尺寸：${canvas.width} x ${canvas.height}`);
    }

    private createHiddenInput(): void {
        let input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.style.display = "none";
        document.body.appendChild(input);

        input.addEventListener("change", (event) => {
            this.onImageSelected(event);
            document.body.removeChild(input);
        });
        input.click();
    }

    private onImageSelected(event): void {
        const file = event.target.files[0];
        if (!file || !file.type.startsWith("image/")) {
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const base64Data = e.target.result;
            this.loadSelectedImage(base64Data as string);
        }
        reader.onerror = (error) => {

        }
        reader.readAsDataURL(file);
    }

    private loadSelectedImage(base64Data: string): void {
        let img = new Image();
        img.onload = () => {
            console.log(`${img.width} x ${img.height}`);

            let imageAsset = new ImageAsset(img);
            let texture = new Texture2D();
            texture.image = imageAsset;
            let spriteFrame = new SpriteFrame();
            spriteFrame.texture = texture;
            this._sprite.spriteFrame = spriteFrame;

            let scaleX = img.width / this._originSize.width;
            let scaleY = img.height / this._originSize.height;
            let scale = Math.max(scaleX, scaleY);
            this._spriteTransform.width = img.width / scale;
            this._spriteTransform.height = img.height / scale;
        }
        img.src = base64Data;
    }
}
