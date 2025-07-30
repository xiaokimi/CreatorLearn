import { assetManager, Asset, AssetManager } from 'cc';

export class ResourceManager {
    private static _instance: ResourceManager | null = null;
    private _cache: Map<string, Asset> = new Map();
    private _bundleCache: Map<string, AssetManager.Bundle> = new Map();

    private constructor() {}

    public static getInstance(): ResourceManager {
        if (!ResourceManager._instance) {
            ResourceManager._instance = new ResourceManager();
        }
        return ResourceManager._instance;
    }

    /**
     * 加载单个资源
     * @param path 资源路径（相对于 resources）
     * @param type 资源类型
     */
    public load<T extends Asset>(path: string, type: typeof Asset): Promise<T> {
        // 优先返回缓存
        if (this._cache.has(path)) {
            return Promise.resolve(this._cache.get(path) as T);
        }
        return new Promise<T>((resolve, reject) => {
            assetManager.resources.load(path, type, (err, asset) => {
                if (err || !asset) {
                    console.error(err || new Error('Asset not found: ' + path));
                    resolve(null);
                    return;
                }
                this._cache.set(path, asset);
                resolve(asset as T);
            });
        });
    }

    /**
     * 加载多个资源
     * @param paths 资源路径数组
     * @param type 资源类型
     */
    public loadArray<T extends Asset>(paths: string[], type: typeof Asset): Promise<T[]> {
        return Promise.all(paths.map(path => this.load<T>(path, type)));
    }

    /**
     * 释放单个资源
     * @param path 资源路径
     */
    public release(path: string) {
        const asset = this._cache.get(path);
        if (asset) {
            assetManager.releaseAsset(asset);
            this._cache.delete(path);
        }
    }

    /**
     * 释放所有缓存资源
     */
    public releaseAll() {
        this._cache.forEach(asset => {
            assetManager.releaseAsset(asset);
        });
        this._cache.clear();
    }

    /**
     * 加载 bundle
     */
    public loadBundle(nameOrUrl: string): Promise<AssetManager.Bundle> {
        if (this._bundleCache.has(nameOrUrl)) {
            return Promise.resolve(this._bundleCache.get(nameOrUrl)!);
        }
        return new Promise((resolve, reject) => {
            assetManager.loadBundle(nameOrUrl, (err, bundle) => {
                if (err || !bundle) {
                    console.error(err || new Error('Bundle not found: ' + nameOrUrl));
                    resolve(null);
                    return;
                }
                this._bundleCache.set(nameOrUrl, bundle);
                resolve(bundle);
            });
        });
    }

    /**
     * 从 bundle 加载资源
     */
    public async loadFromBundle<T extends Asset>(bundleName: string, path: string, type: typeof Asset): Promise<T> {
        const bundle = await this.loadBundle(bundleName);
        if (!bundle) {
            return null;
        }
        const cacheKey = `${bundleName}:${path}`;
        if (this._cache.has(cacheKey)) {
            return this._cache.get(cacheKey) as T;
        }
        return new Promise<T>((resolve, reject) => {
            bundle.load(path, type, (err, asset) => {
                if (err || !asset) {
                    console.error(err || new Error(`Asset not found in bundle: ${bundleName}/${path}`));
                    resolve(null);
                    return;
                }
                this._cache.set(cacheKey, asset);
                resolve(asset as T);
            });
        });
    }

    /**
     * 释放 bundle
     */
    public releaseBundle(bundleName: string) {
        const bundle = this._bundleCache.get(bundleName);
        if (bundle) {
            bundle.releaseAll();
            this._bundleCache.delete(bundleName);
        }
    }
}

export const resourceMgr = ResourceManager.getInstance();
