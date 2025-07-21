import { _decorator, Button, Component } from 'cc';
import { autoBindNode, initBindings } from '../framework/NodeDecorator';
import { ScrollViewController } from '../framework/ScrollViewController';
import { ShopData } from '../prefabs/ShopItem';
const { ccclass } = _decorator;

@ccclass('Test')
export class Test extends Component {
    @autoBindNode("ScrollView", ScrollViewController)
    private _scrollViewController: ScrollViewController | null = null;

    @autoBindNode("Button_add", Button)
    private _buttonAdd: Button | null = null;

    @initBindings
    protected onLoad(): void {
        this._buttonAdd.node.on(Button.EventType.CLICK, this.onButtonAddClick, this);
    }

    protected onDestroy(): void {
        this._buttonAdd.node.off(Button.EventType.CLICK, this.onButtonAddClick, this);
    }

    private onButtonAddClick(): void {
        const shopList: ShopData[] = [];
        for (let i = 0; i < 100; i++) {
            shopList.push({
                name: `id_${i}`,
                desc: '1111',
                amount: '2222'
            });
        }
        this._scrollViewController.updateItemDataList(shopList);
    }
}
