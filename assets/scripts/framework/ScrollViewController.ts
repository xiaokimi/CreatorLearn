import { _decorator, Component, instantiate, Prefab, ScrollView, UITransform, NodePool, Node, CCString, Size, CCInteger, Vec2 } from 'cc';
import { autoBindNode, initBindings } from './NodeDecorator';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('ScrollViewController')
@requireComponent(ScrollView)
export class ScrollViewController extends Component {
    @property(Prefab)
    prefab: Prefab | null = null;

    @property(CCString)
    poolHandlerComponent: string = "";

    @property(CCInteger)
    padding: number = 0;

    @autoBindNode(ScrollView)
    private _scrollView: ScrollView | null = null;

    private _nodePool: NodePool | null = null;
    private _itemDataList: any[] = [];
    private _itemPosList: Vec2[] = [];
    private _itemNodeMap: Map<number, Node> = new Map<number, Node>();

    private _bInitItemTransform = false;
    private _itemSize: Size = new Size(0, 0);
    private _itemAnchor: Vec2 = new Vec2(0, 0);

    private _minCheckOffset: number = 50;
    private _scrollContentPos: number = 0;
    private _visibleStartIndex: number = -1;
    private _visibleEndIndex: number = -1;
    private _visibleTopOrLeft: number = 0;
    private _visibleBottomOrRight: number = 0;

    @initBindings
    protected onLoad(): void {
        this._nodePool = new NodePool(this.poolHandlerComponent);

        this.initItemTransform();
    }

    protected onDestroy(): void {
        this._nodePool.clear();
    }

    protected update(dt: number): void {
        const pos = this._scrollView.horizontal ? this._scrollView.content.x : this._scrollView.content.y;
        const dir = pos - this._scrollContentPos;
        if (Math.abs(dir) <= this._minCheckOffset) {
            return;
        }
        this._scrollContentPos = pos;

        const startIndex = this.binarySearchStartIndex();
        const endIndex = this.binarySearchEndIndex();
        if (this._visibleStartIndex === startIndex && this._visibleEndIndex === endIndex) {
            return;
        }

        // 先移除
        for (let i = this._visibleStartIndex; i <= this._visibleEndIndex; i++) {
            if (i >= 0 && (i < startIndex || i > endIndex)) {
                this.removeItemNode(i);
            }
        }

        // 再添加
        for (let i = startIndex; i <= endIndex; i++) {
            if (i >= 0 && !this._itemNodeMap.get(i)) {
                this.pushItemNode(i);
            }
        }

        this._visibleStartIndex = startIndex;
        this._visibleEndIndex = endIndex;
    }

    public updateItemDataList(dataList: any[]): void {
        // 先将当前节点清理
        for (let i = this._visibleStartIndex; i <= this._visibleEndIndex; i++) {
            if (i >= 0) {
                this.removeItemNode(i);
            }
        }

        const n = dataList.length;

        // 设置滚动区域大小
        const transform = this._scrollView.content.getComponent(UITransform);
        if (this._scrollView.horizontal) {
            const width = n * this._itemSize.width + (n - 1) * this.padding;
            transform.setContentSize(width, transform.contentSize.height);
        } else if (this._scrollView.vertical) {
            const height = n * this._itemSize.height + (n - 1) * this.padding;
            transform.setContentSize(transform.contentSize.width, height);
        }

        // 数据清理
        this._itemDataList.length = 0;
        this._itemDataList = dataList;

        this._visibleStartIndex = this.binarySearchStartIndex();
        this._visibleEndIndex = this.binarySearchEndIndex();

        if (this._scrollView.horizontal) {
            let x = this._itemSize.width * this._itemAnchor.x;
            const y = this._itemSize.height * (this._itemAnchor.y - 0.5);
            for (let i = 0; i < n; i++) {
                this._itemPosList.push(new Vec2(x, y));
                x += this._itemSize.width + this.padding;

                if (i >= this._visibleStartIndex && i <= this._visibleEndIndex) {
                    this.pushItemNode(i);
                }
            }
        } else if (this._scrollView.vertical) {
            const x = this._itemSize.width * (this._itemAnchor.x - 0.5);
            let y = this._itemSize.height * (this._itemAnchor.y - 1.0);
            for (let i = 0; i < n; i++) {
                this._itemPosList.push(new Vec2(x, y));
                y -= this._itemSize.height + this.padding;

                if (i >= this._visibleStartIndex && i <= this._visibleEndIndex) {
                    this.pushItemNode(i);
                }
            }
        }
    }

    private updateVisibleView(): void {
        
    }

    private pushItemNode(index: number): void {
        const itemNode = this.getItemNode(this._itemDataList[index]);
        this._scrollView.content.addChild(itemNode);
        itemNode.setPosition(this._itemPosList[index].x, this._itemPosList[index].y);
        this._itemNodeMap.set(index, itemNode);
    }

    private removeItemNode(index: number): void {
        const itemNode = this._itemNodeMap.get(index);
        if (itemNode) {
            this._itemNodeMap.delete(index);
            this._nodePool.put(itemNode);
        }
    }

    private getItemNode(itemData: any): Node {
        if (this._nodePool.size() == 0) {
            this.createItemNode();
        }
        return this._nodePool.get(itemData);
    }

    private createItemNode(): Node {
        const itemNode = instantiate(this.prefab);
        itemNode.addComponent(this.poolHandlerComponent);
        // 确保调用脚本的 onLoad 方法，必须要先加入，执行对应的生命周期函数
        this._scrollView.content.addChild(itemNode);

        // 放入缓存池
        this._nodePool.put(itemNode);
        return itemNode;
    }

    private initItemTransform(): void {
        if (this._bInitItemTransform) {
            return;
        }
        this._bInitItemTransform = true;

        // 节点信息
        const itemNode = this.createItemNode();
        const itemTransform = itemNode.getComponent(UITransform);
        this._itemSize = itemTransform.contentSize;
        this._itemAnchor = itemTransform.anchorPoint;

        // 滚动区域信息
        const scrollViewTransform = this.node.getComponent(UITransform);
        const scrollViewSize = scrollViewTransform.contentSize;
        const scrollViewArchor = scrollViewTransform.anchorPoint;

        // 目前只支持一个方向的滚动
        if (this._scrollView.horizontal) {
            this._visibleTopOrLeft = scrollViewSize.width * (scrollViewArchor.x - 1) - this._itemSize.width;
            this._visibleBottomOrRight = scrollViewSize.width * scrollViewArchor.x + this._itemSize.width;

            this._scrollContentPos = this._scrollView.content.x;
            this._minCheckOffset = this._itemSize.width / 3;
        } else if (this._scrollView.vertical) {
            this._visibleTopOrLeft = scrollViewSize.height * (1 - scrollViewArchor.y) + this._itemSize.height;
            this._visibleBottomOrRight = -(scrollViewSize.height * scrollViewArchor.y + this._itemSize.height);

            this._scrollContentPos = this._scrollView.content.y;
            this._minCheckOffset = this._itemSize.height / 3;
        }
    }

    private binarySearchStartIndex(): number {
        let startIndex = -1;
        if (this._scrollView.horizontal) {
            const x = this._scrollView.content.x;
            const itemOffset = this._itemSize.width * this._itemAnchor.x;

            let left = 0, right = this._itemDataList.length - 1;
            while (left <= right) {
                const mid = left + Math.floor((right - left) / 2);
                const pos = x + (this._itemSize.width + this.padding) * mid + itemOffset;
                if (pos < this._visibleTopOrLeft) {
                    left = mid + 1;
                } else if (pos <= this._visibleBottomOrRight) {
                    startIndex = mid;
                    right = mid - 1;
                } else {
                    right = mid - 1;
                }
            }
        } else if (this._scrollView.vertical) {
            const y = this._scrollView.content.y;
            const itemOffset = this._itemSize.height * (this._itemAnchor.y - 1.0);

            let left = 0, right = this._itemDataList.length - 1;
            while (left <= right) {
                const mid = left + Math.floor((right - left) / 2);
                const pos = y - (this._itemSize.height + this.padding) * mid + itemOffset;
                if (pos > this._visibleTopOrLeft) {
                    left = mid + 1;
                } else if (pos >= this._visibleBottomOrRight) {
                    startIndex = mid;
                    right = mid - 1;
                } else {
                    right = mid - 1;
                }
            }
        }
        return startIndex;
    }

    private binarySearchEndIndex(): number {
        let endIndex = -1;

        if (this._scrollView.horizontal) {
            const x = this._scrollView.content.x;
            const itemOffset = this._itemSize.width * this._itemAnchor.x;

            let left = 0, right = this._itemDataList.length - 1;
            while (left <= right) {
                const mid = left + Math.floor((right - left) / 2);
                const pos = x + (this._itemSize.width + this.padding) * mid + itemOffset;
                if (pos > this._visibleBottomOrRight) {
                    right = mid - 1;
                } else if (pos >= this._visibleTopOrLeft) {
                    endIndex = mid;
                    left = mid + 1;
                } else {
                    left = mid + 1;
                }
            }
        } else if (this._scrollView.vertical) {
            const y = this._scrollView.content.y;
            const itemOffset = this._itemSize.height * (this._itemAnchor.y - 1.0);

            let left = 0, right = this._itemDataList.length - 1;
            while (left <= right) {
                const mid = left + Math.floor((right - left) / 2);
                const pos = y - (this._itemSize.height + this.padding) * mid + itemOffset;
                if (pos < this._visibleBottomOrRight) {
                    right = mid - 1;
                } else if (pos <= this._visibleTopOrLeft) {
                    endIndex = mid;
                    left = mid + 1;
                } else {
                    left = mid + 1;
                }
            }
        }
        return endIndex;
    }
}
