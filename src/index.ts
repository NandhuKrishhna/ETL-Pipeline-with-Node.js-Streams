import { CsvGenerator } from './core/CsvGenerator';
import { Logger } from './utils/Logger';

const generator = new CsvGenerator();

generator.generate().catch(err => {
    Logger.log('Fatal Error: ' + err);
    process.exit(1);
});
