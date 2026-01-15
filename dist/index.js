"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CsvGenerator_1 = require("./core/CsvGenerator");
const Logger_1 = require("./utils/Logger");
const generator = new CsvGenerator_1.CsvGenerator();
generator.generate().catch(err => {
    Logger_1.Logger.log('Fatal Error: ' + err);
    process.exit(1);
});
