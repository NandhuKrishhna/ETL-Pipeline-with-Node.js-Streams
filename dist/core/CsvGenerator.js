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
exports.CsvGenerator = void 0;
const fs = __importStar(require("fs"));
const AppConfig_1 = require("../config/AppConfig");
const Logger_1 = require("../utils/Logger");
class CsvGenerator {
    constructor() {
        this.fd = null;
        this.offset = 0;
        this.currentFileSize = 0;
        this.buffer = Buffer.alloc(AppConfig_1.AppConfig.BUFFER_SIZE);
    }
    async generate() {
        try {
            Logger_1.Logger.log(`Starting CSV Generation... Target Size: ${(AppConfig_1.AppConfig.TARGET_FILE_SIZE / 1024 / 1024).toFixed(2)} MB`);
            this.fd = fs.openSync(AppConfig_1.AppConfig.OUTPUT_FILENAME, 'w');
            // Write Header
            this.writeToBuffer('id,name,email,city,salary\n');
            let id = 1;
            let lastLogTime = Date.now();
            const cities = ['New York', 'London', 'Tokyo', 'Paris', 'Berlin', 'Sydney', 'Toronto', 'Mumbai'];
            const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda'];
            const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
            const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
            while (this.currentFileSize < AppConfig_1.AppConfig.TARGET_FILE_SIZE) {
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
                    Logger_1.Logger.logProgress(this.currentFileSize, AppConfig_1.AppConfig.TARGET_FILE_SIZE);
                    lastLogTime = Date.now();
                }
            }
            this.flush(); // Flush remaining data
            Logger_1.Logger.log('CSV Generation Completed Successfully!');
            Logger_1.Logger.logProgress(this.currentFileSize, AppConfig_1.AppConfig.TARGET_FILE_SIZE);
        }
        catch (error) {
            Logger_1.Logger.log(`Error during generation: ${error}`);
            throw error;
        }
        finally {
            if (this.fd !== null) {
                fs.closeSync(this.fd);
                this.fd = null;
            }
        }
    }
    writeToBuffer(data) {
        const dataLength = Buffer.byteLength(data);
        // If data doesn't fit in remaining buffer, flush first
        if (this.offset + dataLength > this.buffer.length) {
            this.flush();
        }
        // Write data to buffer
        const written = this.buffer.write(data, this.offset);
        this.offset += written;
    }
    flush() {
        if (this.offset === 0 || this.fd === null)
            return;
        fs.writeSync(this.fd, this.buffer, 0, this.offset);
        this.currentFileSize += this.offset;
        this.offset = 0;
    }
}
exports.CsvGenerator = CsvGenerator;
