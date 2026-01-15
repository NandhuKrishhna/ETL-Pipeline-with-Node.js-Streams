import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

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
        
        const exitCode = await new Promise<number>((resolve, reject) => {
            const child = spawn('npx', ['ts-node', 'src/index.ts', '--size=0.001'], {
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
