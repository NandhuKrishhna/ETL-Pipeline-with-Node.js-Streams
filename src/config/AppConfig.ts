export class AppConfig {
    // Default to 1GB if not provided
    public static readonly TARGET_FILE_SIZE = this.parseSizeArg() || 1 * 1024 * 1024 * 1024; 
    public static readonly BUFFER_SIZE = 64 * 1024; 
    public static readonly OUTPUT_FILENAME = 'big-data.csv';

    private static parseSizeArg(): number | null {
        // Look for --size=5GB in command line args
        const sizeArg = process.argv.find(arg => arg.startsWith('--size='));
        if (sizeArg) {
            const gb = parseFloat(sizeArg.split('=')[1]);
            return gb * 1024 * 1024 * 1024;
        }
        return null;
    }
}
