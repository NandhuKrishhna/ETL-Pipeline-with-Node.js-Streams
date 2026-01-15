import * as fs from 'fs';
import { AppConfig } from '../config/AppConfig';
import { Logger } from '../utils/Logger';


export class CsvGenerator {
    private fd: number | null = null;
    private buffer: Buffer;
    private offset: number = 0;
    private currentFileSize: number = 0;

    constructor() {
        this.buffer = Buffer.alloc(AppConfig.BUFFER_SIZE);
    }

    public async generate(): Promise<void> {
        try {
            Logger.log(`Starting CSV Generation... Target Size: ${(AppConfig.TARGET_FILE_SIZE / 1024 / 1024).toFixed(2)} MB`);
            this.fd = fs.openSync(AppConfig.OUTPUT_FILENAME, 'w');
            
            // Write Header
            this.writeToBuffer('id,name,email,city,salary\n');

            let id = 1;
            let lastLogTime = Date.now();

            const cities = ['New York', 'London', 'Tokyo', 'Paris', 'Berlin', 'Sydney', 'Toronto', 'Mumbai'];
            const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda'];
            const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
            const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];

            while (this.currentFileSize < AppConfig.TARGET_FILE_SIZE) {
                // Generate realistic data manually
                const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
                const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
                const name = `${firstName} ${lastName}`;
                const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domains[Math.floor(Math.random() * domains.length)]}`;
                const city = cities[Math.floor(Math.random() * cities.length)];
                const salary = Math.floor(Math.random() * (150000 - 50000 + 1)) + 50000;

                const row = `${id},${name},${email},"${city}",${salary}\n`;
                this.writeToBuffer(row);
                id++;

                // Log progress roughly every 2 seconds
                if (Date.now() - lastLogTime > 2000) {
                     Logger.logProgress(this.currentFileSize, AppConfig.TARGET_FILE_SIZE);
                     lastLogTime = Date.now();
                }
            }

            this.flush(); // Flush remaining data
            
            Logger.log('CSV Generation Completed Successfully!');
            Logger.logProgress(this.currentFileSize, AppConfig.TARGET_FILE_SIZE);

        } catch (error) {
            Logger.log(`Error during generation: ${error}`);
            throw error;
        } finally {
            if (this.fd !== null) {
                fs.closeSync(this.fd);
                this.fd = null;
            }
        }
    }

    private writeToBuffer(data: string): void {
        const dataLength = Buffer.byteLength(data);

        // If data doesn't fit in remaining buffer, flush first
        if (this.offset + dataLength > this.buffer.length) {
            this.flush();
        }
        
        // Write data to buffer
        const written = this.buffer.write(data, this.offset);
        this.offset += written;
    }

    private flush(): void {
        if (this.offset === 0 || this.fd === null) return;

        fs.writeSync(this.fd, this.buffer, 0, this.offset);
        this.currentFileSize += this.offset;
        this.offset = 0;
    }
}
