import { Component } from "cc";

interface IBindingConfig {
    target: string | typeof Component;
    component?: typeof Component;
}

const BINDINGS_KEY = Symbol("__bindings__");

export function autoBindNode(target: string | typeof Component, component?: typeof Component) {
    return function (classPrototype: Object, propertyKey: string | symbol) {
        if (!classPrototype[BINDINGS_KEY]) {
            classPrototype[BINDINGS_KEY] = new Map<string | symbol, IBindingConfig>();
        }

        classPrototype[BINDINGS_KEY].set(propertyKey, { target, component });
    };
}

export function initBindings(target: Component, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function() {
        const bindingsMap = this.constructor.prototype[BINDINGS_KEY];

        if (bindingsMap) {
            bindingsMap.forEach((binding: IBindingConfig, property: string) => {
                if (typeof binding.target === "string") {
                    const node = this.node.getChildByPath(binding.target);
                
                    if (node) {
                        this[property] = binding.component ? node.getComponent(binding.component) : node;
                    } else {
                        console.warn(`[autoBindNode] Node not found: ${binding.target}`);
                        this[property] = null;
                    }
                } else if (typeof binding.target === "function" && binding.target.prototype instanceof Component) {
                    this[property] = this.getComponent(binding.target);
                }
            });
        }

        if (originalMethod) {
            originalMethod.apply(this);
        }
    };
}
