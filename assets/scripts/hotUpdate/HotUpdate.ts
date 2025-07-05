import { _decorator, Component, game, native, Node } from 'cc';
import { MD5 } from './MD5';
import { NATIVE } from 'cc/env';

const { ccclass } = _decorator;

@ccclass('HotUpdate')
export class HotUpdate extends Component {
    private _assetsManager: native.AssetsManager | null = null;

    protected onLoad(): void {
        if (!NATIVE) {
            return;
        }

        const storagePath: string = native.fileUtils.getWritablePath() + "remote-asset";
        this._assetsManager = new native.AssetsManager("", storagePath);

        this._assetsManager.setVersionCompareHandle(function(versionA: string, versionB: string): number {
            const versionAMap = versionA.split('.');
            const versionBMap = versionB.split('.');
            for (let i = 0; i < versionAMap.length; i++) {
                const numA = parseInt(versionAMap[i]);
                const numB = parseInt(versionBMap[i]);
                if (numA === numB) {
                    continue;
                }
                return numA - numB;
            }
            return 0;
        });

        this._assetsManager.setVerifyCallback(function(path: string, asset: any): boolean {
            const buffer = native.fileUtils.getDataFromFile(path);
            return MD5(new Uint8Array(buffer)) === asset.md5;
        })

        this._assetsManager.setEventCallback(this.assetsManagerEventCallback.bind(this));

        if (this._assetsManager.loadLocalManifest("project.manifest")) {
            this._assetsManager.checkUpdate();
        }
    }

    protected assetsManagerEventCallback(event: native.EventAssetsManager): void {
        switch (event.getEventCode()) {
            case native.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
            case native.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case native.EventAssetsManager.ERROR_PARSE_MANIFEST:
                this.onCheckUpdateFailed();
                break;
            case native.EventAssetsManager.NEW_VERSION_FOUND:
                this.onNewVersionFound();
                break;
            case native.EventAssetsManager.ALREADY_UP_TO_DATE:
                this.onAlreadyUpToData();
                break;
            case native.EventAssetsManager.UPDATE_PROGRESSION:
                this.onUpdateProgression();
                break;
            case native.EventAssetsManager.ASSET_UPDATED:
                break;
            case native.EventAssetsManager.ERROR_UPDATING:
                break;
            case native.EventAssetsManager.UPDATE_FINISHED:
                this.onUpdateFinished();
                break;
            case native.EventAssetsManager.UPDATE_FAILED:
                this.onUpdateFailed();
                break;
            case native.EventAssetsManager.ERROR_DECOMPRESS:
                break;
        }
    }

    protected onCheckUpdateFailed(): void {

    }

    protected onNewVersionFound(): void {
        const total = Math.ceil(this._assetsManager.getTotalBytes() / 1024);
        this._assetsManager.update();
    }

    protected onAlreadyUpToData(): void {

    }

    protected onUpdateProgression(): void {
        const downloadBytes = this._assetsManager.getDownloadedBytes();
        const totalBytes = this._assetsManager.getTotalBytes();
    }

    protected onUpdateFinished(): void {
        game.restart();
    }

    protected onUpdateFailed(): void {
        this._assetsManager.downloadFailedAssets();
    }
}
