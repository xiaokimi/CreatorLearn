"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onAfterBuild = exports.unload = exports.load = exports.throwError = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
// @ts-ignore
const package_json_1 = __importDefault(require("../package.json"));
const PACKAGE_NAME = package_json_1.default.name;
exports.throwError = true;
const load = async function () {
    console.log(PACKAGE_NAME, "load");
};
exports.load = load;
const unload = async function () {
    console.log(PACKAGE_NAME, "unload");
};
exports.unload = unload;
const onAfterBuild = async function (options, result) {
    // fix main.js
    const mainJsPath = path_1.default.join(result.dest, "data", "main.js");
    if (!fs_extra_1.default.existsSync(mainJsPath)) {
        console.error(`main.js not found at: ${mainJsPath}`);
        return;
    }
    await fixSearchPath(mainJsPath);
    // generator manifest
    generatorManifest(options.packages[PACKAGE_NAME], path_1.default.join(result.dest, "data"));
};
exports.onAfterBuild = onAfterBuild;
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
async function fixSearchPath(filePath) {
    try {
        const content = await fs_extra_1.default.readFile(filePath, 'utf-8');
        await fs_extra_1.default.writeFile(filePath, fix_content + content, 'utf-8');
    }
    catch (error) {
        console.error(`Modify main.js error: ${error}`);
    }
}
function generatorManifest(options, src) {
    let manifest = {
        packgeUrl: options.address,
        remoteManifestUrl: options.address + "project.manifest",
        removeVersionUrl: options.address + "version.manifest",
        version: options.version,
        assets: {},
    };
    readDir(src, path_1.default.join(src, 'src'), manifest.assets);
    readDir(src, path_1.default.join(src, 'assets'), manifest.assets);
    readDir(src, path_1.default.join(src, 'jsb-adapter'), manifest.assets);
    try {
        const destManifest = path_1.default.join(src, "project.manifest");
        fs_extra_1.default.writeFile(destManifest, JSON.stringify(manifest), 'utf-8');
        delete manifest.assets;
        const destVersion = path_1.default.join(src, "version.manifest");
        fs_extra_1.default.writeFile(destVersion, JSON.stringify(manifest), 'utf-8');
    }
    catch (error) {
        console.error(error);
    }
}
function readDir(src, dir, obj) {
    try {
        let stat = fs_extra_1.default.statSync(dir);
        if (!stat.isDirectory()) {
            return;
        }
        const subpaths = fs_extra_1.default.readdirSync(dir);
        for (let i = 0; i < subpaths.length; i++) {
            if (subpaths[i][0] === '.') {
                continue;
            }
            const subpath = path_1.default.join(dir, subpaths[i]);
            stat = fs_extra_1.default.statSync(subpath);
            if (stat.isDirectory()) {
                readDir(src, subpath, obj);
            }
            else if (stat.isFile()) {
                let asset = {
                    'size': stat.size,
                    'md5': crypto_1.default.createHash('md5').update(fs_extra_1.default.readFileSync(subpath)).digest('hex'),
                };
                if (path_1.default.extname(subpath).toLowerCase() === '.zip') {
                    asset.compressed = true;
                }
                const relativePath = encodeURI(path_1.default.relative(src, subpath).replace(/\\/g, '/'));
                obj[relativePath] = asset;
            }
        }
    }
    catch (err) {
        console.error(err);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9va3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zb3VyY2UvaG9va3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0Esd0RBQTBCO0FBQzFCLGdEQUF3QjtBQUN4QixvREFBNEI7QUFDNUIsYUFBYTtBQUNiLG1FQUF5QztBQUN6QyxNQUFNLFlBQVksR0FBRyxzQkFBVyxDQUFDLElBQUksQ0FBQztBQXFCekIsUUFBQSxVQUFVLEdBQXlCLElBQUksQ0FBQztBQUU5QyxNQUFNLElBQUksR0FBbUIsS0FBSztJQUNyQyxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxNQUFNLENBQUMsQ0FBQztBQUN0QyxDQUFDLENBQUM7QUFGVyxRQUFBLElBQUksUUFFZjtBQUVLLE1BQU0sTUFBTSxHQUFxQixLQUFLO0lBQ3pDLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ3hDLENBQUMsQ0FBQztBQUZXLFFBQUEsTUFBTSxVQUVqQjtBQUVLLE1BQU0sWUFBWSxHQUEyQixLQUFLLFdBQVUsT0FBeUIsRUFBRSxNQUFvQjtJQUM5RyxjQUFjO0lBQ2QsTUFBTSxVQUFVLEdBQUcsY0FBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztJQUM3RCxJQUFJLENBQUMsa0JBQUUsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQztRQUM3QixPQUFPLENBQUMsS0FBSyxDQUFDLHlCQUF5QixVQUFVLEVBQUUsQ0FBQyxDQUFDO1FBQ3JELE9BQU87SUFDWCxDQUFDO0lBRUQsTUFBTSxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUM7SUFFaEMscUJBQXFCO0lBQ3JCLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxRQUFTLENBQUMsWUFBWSxDQUFhLEVBQUUsY0FBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxD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bGRSZXN1bHQsIElCdWlsZFRhc2tPcHRpb24gfSBmcm9tIFwiQGNvY29zL2NyZWF0b3ItdHlwZXMvZWRpdG9yL3BhY2thZ2VzL2J1aWxkZXIvQHR5cGVzL3Byb3RlY3RlZFwiO1xyXG5pbXBvcnQgZnMgZnJvbSBcImZzLWV4dHJhXCI7XHJcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XHJcbmltcG9ydCBjcnlwdG8gZnJvbSBcImNyeXB0b1wiO1xyXG4vLyBAdHMtaWdub3JlXHJcbmltcG9ydCBwYWNrYWdlSlNPTiBmcm9tIFwiLi4vcGFja2FnZS5qc29uXCJcclxuY29uc3QgUEFDS0FHRV9OQU1FID0gcGFja2FnZUpTT04ubmFtZTtcclxuXHJcbmludGVyZmFjZSBJT3B0aW9ucyB7XHJcbiAgICBhZGRyZXNzOiBzdHJpbmc7XHJcbiAgICB2ZXJzaW9uOiBzdHJpbmc7XHJcbn1cclxuXHJcbmludGVyZmFjZSBJQXNzZXQge1xyXG4gICAgc2l6ZTogbnVtYmVyO1xyXG4gICAgbWQ1OiBzdHJpbmc7XHJcbiAgICBjb21wcmVzc2VkPzogYm9vbGVhbjtcclxufVxyXG5cclxuaW50ZXJmYWNlIElNYW5pZmVzdCB7XHJcbiAgICBwYWNrZ2VVcmw6IHN0cmluZztcclxuICAgIHJlbW90ZU1hbmlmZXN0VXJsOiBzdHJpbmc7XHJcbiAgICByZW1vdmVWZXJzaW9uVXJsOiBzdHJpbmc7XHJcbiAgICB2ZXJzaW9uOiBzdHJpbmc7XHJcbiAgICBhc3NldHM/OiBSZWNvcmQ8c3RyaW5nLCBJQXNzZXQ+O1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgdGhyb3dFcnJvcjogQnVpbGRIb29rLnRocm93RXJyb3IgPSB0cnVlO1xyXG5cclxuZXhwb3J0IGNvbnN0IGxvYWQ6IEJ1aWxkSG9vay5sb2FkID0gYXN5bmMgZnVuY3Rpb24oKSB7XHJcbiAgICBjb25zb2xlLmxvZyhQQUNLQUdFX05BTUUsIFwibG9hZFwiKTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCB1bmxvYWQ6IEJ1aWxkSG9vay51bmxvYWQgPSBhc3luYyBmdW5jdGlvbigpIHtcclxuICAgIGNvbnNvbGUubG9nKFBBQ0tBR0VfTkFNRSwgXCJ1bmxvYWRcIik7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3Qgb25BZnRlckJ1aWxkOiBCdWlsZEhvb2sub25BZnRlckJ1aWxkID0gYXN5bmMgZnVuY3Rpb24ob3B0aW9uczogSUJ1aWxkVGFza09wdGlvbiwgcmVzdWx0OiBJQnVpbGRSZXN1bHQpIHtcclxuICAgIC8vIGZpeCBtYWluLmpzXHJcbiAgICBjb25zdCBtYWluSnNQYXRoID0gcGF0aC5qb2luKHJlc3VsdC5kZXN0LCBcImRhdGFcIiwgXCJtYWluLmpzXCIpO1xyXG4gICAgaWYgKCFmcy5leGlzdHNTeW5jKG1haW5Kc1BhdGgpKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihgbWFpbi5qcyBub3QgZm91bmQgYXQ6ICR7bWFpbkpzUGF0aH1gKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgYXdhaXQgZml4U2VhcmNoUGF0aChtYWluSnNQYXRoKTtcclxuXHJcbiAgICAvLyBnZW5lcmF0b3IgbWFuaWZlc3RcclxuICAgIGdlbmVyYXRvck1hbmlmZXN0KG9wdGlvbnMucGFja2FnZXMhW1BBQ0tBR0VfTkFNRV0gYXMgSU9wdGlvbnMsIHBhdGguam9pbihyZXN1bHQuZGVzdCwgXCJkYXRhXCIpKTtcclxufTtcclxuXHJcbmNvbnN0IGZpeF9jb250ZW50ID0gYFxyXG4oZnVuY3Rpb24oKSB7XHJcbiAgICBpZiAodHlwZW9mIHdpbmRvdy5qc2IgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgY29uc3Qgc3RvcmFnZVBhdGggPSBqc2IuZmlsZVV0aWxzLmdldFdyaXRhYmxlUGF0aCgpICsgXCJyZW1vdGUtYXNzZXRcIjtcclxuICAgICAgICBsZXQgc2VhcmNoUGF0aHMgPSBqc2IuZmlsZVV0aWxzLmdldFNlYXJjaFBhdGhzKCk7XHJcbiAgICAgICAgaWYgKCFzZWFyY2hQYXRocy5pbmNsdWRlcyhzdG9yYWdlUGF0aCkpIHtcclxuICAgICAgICAgICAgc2VhcmNoUGF0aHMudW5zaGlmdChzdG9yYWdlUGF0aCk7XHJcbiAgICAgICAgICAgIGpzYi5maWxlVXRpbHMuc2V0U2VhcmNoUGF0aHMoc2VhcmNoUGF0aHMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSkoKTtcclxuYDsgXHJcblxyXG5hc3luYyBmdW5jdGlvbiBmaXhTZWFyY2hQYXRoKGZpbGVQYXRoOiBzdHJpbmcpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgY29uc3QgY29udGVudCA9IGF3YWl0IGZzLnJlYWRGaWxlKGZpbGVQYXRoLCAndXRmLTgnKTtcclxuICAgICAgICBhd2FpdCBmcy53cml0ZUZpbGUoZmlsZVBhdGgsIGZpeF9jb250ZW50ICsgY29udGVudCwgJ3V0Zi04Jyk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoYE1vZGlmeSBtYWluLmpzIGVycm9yOiAke2Vycm9yfWApO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZW5lcmF0b3JNYW5pZmVzdChvcHRpb25zOiBJT3B0aW9ucywgc3JjOiBzdHJpbmcpIHtcclxuICAgIGxldCBtYW5pZmVzdDogSU1hbmlmZXN0ID0ge1xyXG4gICAgICAgIHBhY2tnZVVybDogb3B0aW9ucy5hZGRyZXNzLFxyXG4gICAgICAgIHJlbW90ZU1hbmlmZXN0VXJsOiBvcHRpb25zLmFkZHJlc3MgKyBcInByb2plY3QubWFuaWZlc3RcIixcclxuICAgICAgICByZW1vdmVWZXJzaW9uVXJsOiBvcHRpb25zLmFkZHJlc3MgKyBcInZlcnNpb24ubWFuaWZlc3RcIixcclxuICAgICAgICB2ZXJzaW9uOiBvcHRpb25zLnZlcnNpb24sXHJcbiAgICAgICAgYXNzZXRzOiB7fSxcclxuICAgIH07XHJcblxyXG4gICAgcmVhZERpcihzcmMsIHBhdGguam9pbihzcmMsICdzcmMnKSwgbWFuaWZlc3QuYXNzZXRzISEpO1xyXG4gICAgcmVhZERpcihzcmMsIHBhdGguam9pbihzcmMsICdhc3NldHMnKSwgbWFuaWZlc3QuYXNzZXRzISEpO1xyXG4gICAgcmVhZERpcihzcmMsIHBhdGguam9pbihzcmMsICdqc2ItYWRhcHRlcicpLCBtYW5pZmVzdC5hc3NldHMhISk7XHJcblxyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBkZXN0TWFuaWZlc3QgPSBwYXRoLmpvaW4oc3JjLCBcInByb2plY3QubWFuaWZlc3RcIik7XHJcbiAgICAgICAgZnMud3JpdGVGaWxlKGRlc3RNYW5pZmVzdCwgSlNPTi5zdHJpbmdpZnkobWFuaWZlc3QpLCAndXRmLTgnKTtcclxuXHJcbiAgICAgICAgZGVsZXRlIG1hbmlmZXN0LmFzc2V0cztcclxuICAgICAgICBjb25zdCBkZXN0VmVyc2lvbiA9IHBhdGguam9pbihzcmMsIFwidmVyc2lvbi5tYW5pZmVzdFwiKTtcclxuICAgICAgICBmcy53cml0ZUZpbGUoZGVzdFZlcnNpb24sIEpTT04uc3RyaW5naWZ5KG1hbmlmZXN0KSwgJ3V0Zi04Jyk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiByZWFkRGlyKHNyYzogc3RyaW5nLCBkaXI6IHN0cmluZywgb2JqOiBSZWNvcmQ8c3RyaW5nLCBJQXNzZXQ+KSB7XHJcbiAgICB0cnkge1xyXG4gICAgICAgIGxldCBzdGF0ID0gZnMuc3RhdFN5bmMoZGlyKTtcclxuICAgICAgICBpZiAoIXN0YXQuaXNEaXJlY3RvcnkoKSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBzdWJwYXRocyA9IGZzLnJlYWRkaXJTeW5jKGRpcik7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdWJwYXRocy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoc3VicGF0aHNbaV1bMF0gPT09ICcuJykge1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHN1YnBhdGggPSBwYXRoLmpvaW4oZGlyLCBzdWJwYXRoc1tpXSk7XHJcbiAgICAgICAgICAgIHN0YXQgPSBmcy5zdGF0U3luYyhzdWJwYXRoKTtcclxuICAgICAgICAgICAgaWYgKHN0YXQuaXNEaXJlY3RvcnkoKSkge1xyXG4gICAgICAgICAgICAgICAgcmVhZERpcihzcmMsIHN1YnBhdGgsIG9iaik7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc3RhdC5pc0ZpbGUoKSkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGFzc2V0OiBJQXNzZXQgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ3NpemUnOiBzdGF0LnNpemUsXHJcbiAgICAgICAgICAgICAgICAgICAgJ21kNSc6IGNyeXB0by5jcmVhdGVIYXNoKCdtZDUnKS51cGRhdGUoZnMucmVhZEZpbGVTeW5jKHN1YnBhdGgpKS5kaWdlc3QoJ2hleCcpLFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHBhdGguZXh0bmFtZShzdWJwYXRoKS50b0xvd2VyQ2FzZSgpID09PSAnLnppcCcpIHtcclxuICAgICAgICAgICAgICAgICAgICBhc3NldC5jb21wcmVzc2VkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCByZWxhdGl2ZVBhdGggPSBlbmNvZGVVUkkocGF0aC5yZWxhdGl2ZShzcmMsIHN1YnBhdGgpLnJlcGxhY2UoL1xcXFwvZywgJy8nKSk7XHJcbiAgICAgICAgICAgICAgICBvYmpbcmVsYXRpdmVQYXRoXSA9IGFzc2V0OyBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcclxuICAgIH1cclxufSJdfQ==