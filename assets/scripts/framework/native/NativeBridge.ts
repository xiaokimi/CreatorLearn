import { native } from 'cc';
import { ANDROID } from 'cc/env';

const CLASS_NAME = "com/cocos/game/NativeBridge";

function hasMethod(methodName: string, signatures: string): boolean {
    return native.reflection.callStaticMethod(CLASS_NAME, "hasMethod", "(Ljava/lang/String;Ljava/lang/String;)Z", methodName, signatures);
}

export function native_sum(a: number, b: number): number {
    if (ANDROID) {
        const methodName = "sum", signatures = "(II)I";
        if (hasMethod(methodName, signatures)) {
            return native.reflection.callStaticMethod(CLASS_NAME, methodName, signatures, a, b);
        }
    }

    return 0;
}

export function native_getVersionName(): string {
    if (ANDROID) {
        const methodName = "getVersionName", signatures = "()Ljava/lang/String;";
        if (hasMethod(methodName, signatures)) {
            return native.reflection.callStaticMethod(CLASS_NAME, methodName, signatures);
        }
    }
    return "unknown";
}
