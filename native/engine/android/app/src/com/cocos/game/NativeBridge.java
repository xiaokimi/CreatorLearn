package com.cocos.game;

import android.content.Context;
import android.content.pm.PackageInfo;

import java.util.Map;
import java.util.Set;

public class NativeBridge {
    // 一般来说，不需要重载不同签名的情况
    private static final Map<String, String> mMethodCache = Map.of(
            "sum", "(II)I",
            "getVersionCode", "()I",
            "getVersionName", "()Ljava/lang/String;"
    );

    private static Context mContext;
    public static void init(Context context) {
        mContext = context;
    }

    public static int getVersionCode() {
        try {
            PackageInfo packageInfo = mContext.getPackageManager().getPackageInfo(mContext.getPackageName(), 0);
            return packageInfo.versionCode;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return 0;
    }

    public static String getVersionName() {
        try {
            PackageInfo packageInfo = mContext.getPackageManager().getPackageInfo(mContext.getPackageName(), 0);
            return packageInfo.versionName;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "unknown";
    }

    public static boolean hasMethod(String methodName, String signatures) {
        return (mMethodCache.containsKey(methodName) && mMethodCache.get(methodName) == signatures);
    }
}
