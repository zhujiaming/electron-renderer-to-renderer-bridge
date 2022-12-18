export declare class R2rBridgeRenderer {
    private static portMap;
    private static _getPortFromCache;
    static getClientPort(handleId?: string): Promise<MessagePort>;
    static getServicePort(handleId?: string): Promise<MessagePort>;
    static close(port?: MessagePort): void;
}
