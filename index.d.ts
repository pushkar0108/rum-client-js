export interface ITrackPerformanceOptions {
    trackUrl: string;
    threshold?: number;
    batchSize?: number;
    excludeKeys: string[];
    excludeHosts: string[];
    parserCb: any;
    filterCb: any;
    addAdditionalData: any;
}
declare class TrackPerformance {
    static computeMetrics(entry: any): any;
    static chunk(array: any[], size: number): any;
    queuedEntries: any[];
    options: ITrackPerformanceOptions;
    constructor({ trackUrl, threshold, batchSize, excludeKeys, excludeHosts, parserCb, filterCb, addAdditionalData }: ITrackPerformanceOptions);
    handleEntries(entries: any[]): void;
    sendToServer(): void;
}
export default TrackPerformance;
