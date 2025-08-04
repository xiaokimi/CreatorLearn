enum JsEventType {
    QiyuSDK = "QiyuSDK"
}

function js_callback(eventName: string, eventData: string): void {
    if (eventName === JsEventType.QiyuSDK) {
        const jsonObj = JSON.parse(eventData);
        console.log(`cocos 收到原生消息: ${jsonObj.count}, ${jsonObj.message}`);
    }
}

window.js_callback = js_callback;
