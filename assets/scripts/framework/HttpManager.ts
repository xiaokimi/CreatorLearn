export type HttpMethod = 'GET' | 'POST';

export interface HttpRequestOptions {
    method?: HttpMethod;
    headers?: Record<string, string>;
    body?: any;
    timeout?: number; // 毫秒
}

export class HttpManager {
    private static _instance: HttpManager;

    private constructor() {}

    public static getInstance(): HttpManager {
        if (!HttpManager._instance) {
            HttpManager._instance = new HttpManager();
        }
        return HttpManager._instance;
    }

    public request<T = any>(url: string, options: HttpRequestOptions = {}): Promise<T> {
        const { method = 'GET', headers = {}, body, timeout = 10000 } = options;
        return new Promise<T>((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open(method, url, true);
            xhr.timeout = timeout;
            // 设置请求头
            for (const key in headers) {
                xhr.setRequestHeader(key, headers[key]);
            }
            // 监听超时
            xhr.ontimeout = () => {
                reject(new Error('Request timed out'));
            };
            // 监听错误
            xhr.onerror = () => {
                reject(new Error('Network error'));
            };
            // 监听完成
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        const contentType = xhr.getResponseHeader('Content-Type');
                        if (contentType && contentType.indexOf('application/json') !== -1) {
                            try {
                                resolve(JSON.parse(xhr.responseText));
                            } catch (e) {
                                reject(e);
                            }
                        } else {
                            resolve(xhr.responseText as any);
                        }
                    } else {
                        reject(new Error(`HTTP error! status: ${xhr.status}`));
                    }
                }
            };
            // 发送请求
            if (method === 'POST' && body) {
                if (typeof body === 'object' && !(body instanceof FormData)) {
                    xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.send(JSON.stringify(body));
                } else {
                    xhr.send(body);
                }
            } else {
                xhr.send();
            }
        });
    }

    public get<T = any>(url: string, headers: Record<string, string> = {}, timeout = 10000): Promise<T> {
        return this.request<T>(url, { method: 'GET', headers, timeout });
    }

    public post<T = any>(url: string, body: any, headers: Record<string, string> = {}, timeout = 10000): Promise<T> {
        return this.request<T>(url, { method: 'POST', body, headers, timeout });
    }
}
