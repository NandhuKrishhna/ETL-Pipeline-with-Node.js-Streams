"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const projectRoot = path.resolve(__dirname, '../../');
const outputFile = path.join(projectRoot, 'big-data.csv');
describe('CsvGenerator E2E', () => {
    beforeEach(() => {
        // Clean up previous run
        if (fs.existsSync(outputFile)) {
            fs.unlinkSync(outputFile);
        }
    });
    afterEach(() => {
        // Cleanup after test
        if (fs.existsSync(outputFile)) {
            fs.unlinkSync(outputFile);
        }
    });
    test('should generate a CSV file with expected structure and size', async () => {
        // Run the application with a small size (0.01 GB = ~10MB)
        // Using 0.001 GB (~1MB) for faster test
        const exitCode = await new Promise((resolve, reject) => {
            const child = (0, child_process_1.spawn)('npx', ['ts-node', 'src/index.ts', '--size=0.001'], {
                cwd: projectRoot,
                stdio: 'pipe', // Change to pipe to avoid cluttering test output, or keep inherit if debugging
                shell: true
            });
            child.on('close', (code) => {
                resolve(code ?? 0);
            });
            child.on('error', (err) => {
                reject(err);
            });
        });
        expect(exitCode).toBe(0);
        expect(fs.existsSync(outputFile)).toBe(true);
        const stats = fs.statSync(outputFile);
        // It should be roughly 1MB
        expect(stats.size).toBeGreaterThan(0);
        // Verify Content
        const fd = fs.openSync(outputFile, 'r');
        const buffer = Buffer.alloc(1024);
        fs.readSync(fd, buffer, 0, 1024, 0);
        fs.closeSync(fd);
        const content = buffer.toString();
        const lines = content.split('\n');
        // Check Header
        expect(lines[0].trim()).toBe('id,name,email,city,salary');
        // Check First Row
        const firstRow = lines[1];
        const parts = firstRow.split(',');
        expect(parts.length).toBe(5);
    }, 30000); // Increase timeout for E2E test
});
