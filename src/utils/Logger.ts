export class Logger {
    public static log(message: string): void {
        const timestamp = new Date().toISOString();
        const memoryUsage = process.memoryUsage().rss / 1024 / 1024; // Convert to MB
        console.log(`[${timestamp}] [MEM: ${memoryUsage.toFixed(2)} MB] ${message}`);
    }

    public static logProgress(currentBytes: number, totalBytes: number): void {
        const progress = (currentBytes / totalBytes) * 100;
        const currentMB = (currentBytes / 1024 / 1024).toFixed(2);
        const totalMB = (totalBytes / 1024 / 1024).toFixed(2);
        this.log(`Progress: ${progress.toFixed(2)}% (${currentMB}MB / ${totalMB}MB)`);
    }
}
