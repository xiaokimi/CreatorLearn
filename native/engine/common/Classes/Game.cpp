/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You
 shall not use Cocos Creator software for developing other software or tools
 that's used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to
 you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
#include "Game.h"
#include "platform/FileUtils.h"
#include "storage/local-storage/LocalStorage.h"

#ifdef ANDROID
#include "platform/java/jni/JniHelper.h"
#endif

#ifndef GAME_NAME
#define GAME_NAME "CocosGame";
#endif

#ifndef SCRIPT_XXTEAKEY
#define SCRIPT_XXTEAKEY "";
#endif

const std::string CACHE_VERSION_KEY = "cacheVersionCode";
const std::string HOT_UPDATE_PATH = "remote-asset";

Game::Game() = default;

int Game::init() {
    _windowInfo.title = GAME_NAME;
    // configurate window size
    // _windowInfo.height = 600;
    // _windowInfo.width  = 800;

#if CC_DEBUG
    _debuggerInfo.enabled = true;
#else
    _debuggerInfo.enabled = false;
#endif
    _debuggerInfo.port = 6086;
    _debuggerInfo.address = "0.0.0.0";
    _debuggerInfo.pauseOnStart = false;

    _xxteaKey = SCRIPT_XXTEAKEY;

    BaseGame::init();

    checkHotUpdateCache();
    return 0;
}

void Game::onPause() { BaseGame::onPause(); }

void Game::onResume() { BaseGame::onResume(); }

void Game::onClose() { BaseGame::onClose(); }

void Game::checkHotUpdateCache() {
    int nativeVersionCode = 0;
#ifdef ANDROID
    cc::JniMethodInfo methodInfo;
    bool hasMethod = cc::JniHelper::getStaticMethodInfo(methodInfo, "com/cocos/game/NativeBridge", "getVersionCode", "()I");
    if (hasMethod) {
        nativeVersionCode = methodInfo.env->CallStaticIntMethod(methodInfo.classID, methodInfo.methodID);
        methodInfo.env->DeleteLocalRef(methodInfo.classID);
    }
#endif
    int cacheVersionCode = 0;
    std::string cacheVersionStr;
    if (localStorageGetItem(CACHE_VERSION_KEY, &cacheVersionStr)) {
        cacheVersionCode = std::stoi(cacheVersionStr);
    }

    if (nativeVersionCode > cacheVersionCode) {
        cc::FileUtils* fileUtils = cc::FileUtils::getInstance();
        const std::string fullHotUpdatePath = fileUtils->getWritablePath() + HOT_UPDATE_PATH;
        if (fileUtils->isDirectoryExist(fullHotUpdatePath)) {
            fileUtils->removeDirectory(fullHotUpdatePath);
        }
        fileUtils->createDirectory(fullHotUpdatePath);

        cacheVersionStr = std::to_string(nativeVersionCode);
        localStorageSetItem(CACHE_VERSION_KEY, cacheVersionStr);
    }
}

CC_REGISTER_APPLICATION(Game);
