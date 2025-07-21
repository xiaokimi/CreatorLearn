import { _decorator, Component, Label } from 'cc';
import { autoBindNode, initBindings } from '../framework/NodeDecorator';
const { ccclass } = _decorator;

export interface ShopData {
    name: string;
    desc: string;
    amount: string;
}

@ccclass('ShopItem')
export class ShopItem extends Component {
    @autoBindNode("Label_name", Label)
    private _itemName: Label | null = null;

    @autoBindNode("Label_desc", Label)
    private _itemDesc: Label | null = null;

    @autoBindNode("Label_amount", Label)
    private _itemAmount: Label | null = null;

    @initBindings
    protected onLoad(): void {

    }

    protected update(dt: number): void {

    }

    private updateItemData(shopData: ShopData): void {
        this._itemName.string = shopData.name;
        this._itemDesc.string = shopData.desc;
        this._itemAmount.string = shopData.amount;
    }

    // 内存池主动调用的方法
    public unuse(): void {

    }

    public reuse(args: IArguments): void {
        if (args.length > 0) {
            this.updateItemData(args[0] as ShopData);
        }
    }
}
