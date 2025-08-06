#include "bindings/sebind/sebind.h"

namespace {
    struct Empty {};

    float lerp(float a, float b, float t) {
        return (1 - t) * a + t * b;
    }
}

bool jsb_register_simple_math(se::Object *globalThis) {
    sebind::class_<Empty> demoMathClass("simpleMath");
    {
        demoMathClass.staticFunction("lerp", &lerp).install(globalThis);
    }
    return true;
}
