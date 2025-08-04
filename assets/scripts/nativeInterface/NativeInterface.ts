import { _decorator, Component, native, Node } from 'cc';
import { native_sum, native_getVersionName } from '../framework/native/NativeBridge';
const { ccclass, property } = _decorator;

@ccclass('NativeInterface')
export class NativeInterface extends Component {
    protected onLoad(): void {
        //native.jsbBridgeWrapper.addNativeEventListener("getVersion", this.onVersionGet.bind(this));
    
        console.log(`---- 两个参数 sum :${native_sum(10, 20)}`);
        console.log(`------------ versionName: ${native_getVersionName()}`);
    }

    protected onDestroy(): void {
        //native.jsbBridgeWrapper.removeNativeEventListener("getVersion", this.onVersionGet.bind(this));
    }

    private onVersionGet(version: string): void {

    }
}
