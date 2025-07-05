interface IBindingConfig {
    path: string;
    component?: any;
}

export function autoBindNode(path: string, component?: any) {
    return function (target: any, propertyKey: string) {
        if (!target.__bindings__) {
            target.__bindings__ = new Map<string, IBindingConfig>();
        }

        target.__bindings__.set(propertyKey, { path, component });
    };
}

export function initBindings(target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function() {
        if (this.__bindings__) {
            this.__bindings__.forEach((binding: IBindingConfig, property: string) => {
                const node = this.node.getChildByPath(binding.path);
                
                if (node) {
                    this[property] = binding.component ? node.getComponent(binding.component) : node;
                } else {
                    console.warn(`[autoBindNode] Node not found: ${binding.path}`);
                    this[property] = null;
                }
            });
        }

        if (originalMethod) {
            originalMethod.apply(this);
        }
    };
}
