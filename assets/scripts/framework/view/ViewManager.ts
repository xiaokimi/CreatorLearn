export class ViewManager {
    private static _instance: ViewManager | null = null;

    private constructor() {}

    public static getInstance(): ViewManager {
        if (!ViewManager._instance) {
            ViewManager._instance = new ViewManager();
        }
        return ViewManager._instance;
    }

    public show(): void {

    }

    public hide(): void {

    }
}

export const viewMgr = ViewManager.getInstance();