package com.cocos.game;

import android.util.Log;

import com.cocos.lib.CocosHelper;
import com.cocos.lib.CocosJavascriptJavaBridge;

import org.json.JSONException;
import org.json.JSONObject;

public class JsBridge {
    private static final String TAG = "JsBridge";
    private static final String JS_CALLBACK_FORMAT = "window.js_callback('%s', '%s')";

    private static void onJsCallback(String eventName, String eventData) {
        eventData = eventData.replace("'", "\\'");
        final String jsCode = String.format(JS_CALLBACK_FORMAT, eventName, eventData);

        CocosHelper.runOnGameThread(() -> CocosJavascriptJavaBridge.evalString(jsCode));
    }

    public static void onQiyuNewMessage(String message) {
        try {
            JSONObject obj = new JSONObject();
            obj.put("count", 1);
            obj.put("message", message);

            onJsCallback(JsEventType.QIYU_SDK, obj.toString());
        } catch (JSONException e) {

        }
    }
}
