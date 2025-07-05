import { BuildHook, IBuildResult, IBuildTaskOption } from "@cocos/creator-types/editor/packages/builder/@types/protected";
import fs from "fs-extra";
import path from "path";
import crypto from "crypto";
// @ts-ignore
import packageJSON from "../package.json"
const PACKAGE_NAME = packageJSON.name;

interface IOptions {
    address: string;
    version: string;
}

interface IAsset {
    size: number;
    md5: string;
    compressed?: boolean;
}

interface IManifest {
    packgeUrl: string;
    remoteManifestUrl: string;
    removeVersionUrl: string;
    version: string;
    assets?: Record<string, IAsset>;
}

export const throwError: BuildHook.throwError = true;

export const load: BuildHook.load = async function() {
    console.log(PACKAGE_NAME, "load");
};

export const unload: BuildHook.unload = async function() {
    console.log(PACKAGE_NAME, "unload");
};

export const onAfterBuild: BuildHook.onAfterBuild = async function(options: IBuildTaskOption, result: IBuildResult) {
    // fix main.js
    const mainJsPath = path.join(result.dest, "data", "main.js");
    if (!fs.existsSync(mainJsPath)) {
        console.error(`main.js not found at: ${mainJsPath}`);
        return;
    }

    await fixSearchPath(mainJsPath);

    // generator manifest
    generatorManifest(options.packages![PACKAGE_NAME] as IOptions, path.join(result.dest, "data"));
};

const fix_content = `
(function() {
    if (typeof window.jsb === 'object') {
        const storagePath = jsb.fileUtils.getWritablePath() + "remote-asset";
        let searchPaths = jsb.fileUtils.getSearchPaths();
        if (!searchPaths.includes(storagePath)) {
            searchPaths.unshift(storagePath);
            jsb.fileUtils.setSearchPaths(searchPaths);
        }
    }
})();
`; 

async function fixSearchPath(filePath: string) {
    try {
        const content = await fs.readFile(filePath, 'utf-8');
        await fs.writeFile(filePath, fix_content + content, 'utf-8');
    } catch (error) {
        console.error(`Modify main.js error: ${error}`);
    }
}

function generatorManifest(options: IOptions, src: string) {
    let manifest: IManifest = {
        packgeUrl: options.address,
        remoteManifestUrl: options.address + "project.manifest",
        removeVersionUrl: options.address + "version.manifest",
        version: options.version,
        assets: {},
    };

    readDir(src, path.join(src, 'src'), manifest.assets!!);
    readDir(src, path.join(src, 'assets'), manifest.assets!!);
    readDir(src, path.join(src, 'jsb-adapter'), manifest.assets!!);

    try {
        const destManifest = path.join(src, "project.manifest");
        fs.writeFile(destManifest, JSON.stringify(manifest), 'utf-8');

        delete manifest.assets;
        const destVersion = path.join(src, "version.manifest");
        fs.writeFile(destVersion, JSON.stringify(manifest), 'utf-8');
    } catch (error) {
        console.error(error);
    }
}

function readDir(src: string, dir: string, obj: Record<string, IAsset>) {
    try {
        let stat = fs.statSync(dir);
        if (!stat.isDirectory()) {
            return;
        }

        const subpaths = fs.readdirSync(dir);
        for (let i = 0; i < subpaths.length; i++) {
            if (subpaths[i][0] === '.') {
                continue;
            }

            const subpath = path.join(dir, subpaths[i]);
            stat = fs.statSync(subpath);
            if (stat.isDirectory()) {
                readDir(src, subpath, obj);
            } else if (stat.isFile()) {
                let asset: IAsset = {
                    'size': stat.size,
                    'md5': crypto.createHash('md5').update(fs.readFileSync(subpath)).digest('hex'),
                }
                if (path.extname(subpath).toLowerCase() === '.zip') {
                    asset.compressed = true;
                }

                const relativePath = encodeURI(path.relative(src, subpath).replace(/\\/g, '/'));
                obj[relativePath] = asset; 
            }
        }
    } catch (err) {
        console.error(err);
    }
}