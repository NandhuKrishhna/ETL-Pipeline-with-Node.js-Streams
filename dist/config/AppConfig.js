"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppConfig = void 0;
class AppConfig {
    static parseSizeArg() {
        // Look for --size=5GB in command line args
        const sizeArg = process.argv.find(arg => arg.startsWith('--size='));
        if (sizeArg) {
            const gb = parseFloat(sizeArg.split('=')[1]);
            return gb * 1024 * 1024 * 1024;
        }
        return null;
    }
}
exports.AppConfig = AppConfig;
_a = AppConfig;
// Default to 1GB if not provided
AppConfig.TARGET_FILE_SIZE = _a.parseSizeArg() || 1 * 1024 * 1024 * 1024;
AppConfig.BUFFER_SIZE = 64 * 1024;
AppConfig.OUTPUT_FILENAME = 'big-data.csv';
