type Callback = (...args: any[]) => void;

interface IEventHandler {
    callback: Callback;
    target?: any;
}

export class EventManager {
    private static _instance: EventManager | null = null;
    private _eventMap: Map<string, IEventHandler[]> = new Map();

    private constructor() {}

    public static getInstance(): EventManager {
        if (!EventManager._instance) {
            EventManager._instance = new EventManager();
        }
        return EventManager._instance;
    }

    /**
     * 注册事件监听器
     * @param eventName 事件名称
     * @param callback 回调函数
     * @param target 回调函数的 this 上下文
     */
    public on(eventName: string, callback: Callback, target?: any): void {
        if (!this._eventMap.has(eventName)) {
            this._eventMap.set(eventName, []);
        }
        const handlers = this._eventMap.get(eventName)!;
        // 防止重复注册
        if (handlers.some(h => h.callback === callback && h.target === target)) {
            console.warn(`Event listener for "${eventName}" is already registered.`);
            return;
        }
        handlers.push({ callback, target });
    }

    /**
     * 注销事件监听器
     * @param eventName 事件名称
     * @param callback 回调函数
     * @param target 回调函数的 this 上下文
     */
    public off(eventName: string, callback: Callback, target?: any): void {
        const handlers = this._eventMap.get(eventName);
        if (!handlers) {
            return;
        }

        const index = handlers.findIndex(h => h.callback === callback && h.target === target);
        if (index !== -1) {
            handlers.splice(index, 1);
        }
        
        if (handlers.length === 0) {
            this._eventMap.delete(eventName);
        }
    }

    /**
     * 注销指定目标上的所有事件监听器
     * @param target 要移除所有监听器的目标对象
     */
    public offAllForTarget(target: any): void {
        if (!target) return;
        this._eventMap.forEach((handlers, eventName) => {
            const remainingHandlers = handlers.filter(h => h.target !== target);
            if (remainingHandlers.length < handlers.length) {
                 if (remainingHandlers.length > 0) {
                    this._eventMap.set(eventName, remainingHandlers);
                } else {
                    this._eventMap.delete(eventName);
                }
            }
        });
    }

    /**
     * 派发事件
     * @param eventName 事件名称
     * @param args 传递给监听器的参数
     */
    public emit(eventName: string, ...args: any[]): void {
        const handlers = this._eventMap.get(eventName);
        if (!handlers) {
            return;
        }
        // 创建副本以防在派发过程中修改数组
        const handlersToExecute = [...handlers];
        for (const handler of handlersToExecute) {
            try {
                handler.callback.apply(handler.target, args);
            } catch (e) {
                console.error(`Error in event listener for "${eventName}":`, e);
            }
        }
    }

    /**
     * 清除所有已注册的事件监听器
     */
    public clearAll(): void {
        this._eventMap.clear();
    }
}

export const eventMgr = EventManager.getInstance();