# Custom Line-by-Line File Processor

A high-performance Node.js application for generating large CSV datasets and processing them. This project demonstrates efficient file handling, stream processing (implied for future steps), and manual data generation without heavy external dependencies.

## Features

- **High-Performance CSV Generation**: Generates large CSV files with configurable sizes.
- **Manual Data Generation**: Uses lightweight, built-in arrays for random data generation (names, emails, cities, salaries) to keep dependencies minimal.
- **Configurable Output**: easily adjust the target file size via command line arguments.
- **TypeScript Support**: Built with TypeScript for type safety and better developer experience.
- **Robust Testing**: Includes E2E tests using Jest.

## Prerequisites

- Node.js (v14 or higher)
- npm

## Installation

1. Clone the repository (if not already done).
2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

### Generate Data

To generate a CSV file, use the following command. You can specify the target size in GB (fractional values are supported).

```bash
# Generate a ~10MB file (0.01 GB)
npx ts-node src/index.ts --size=0.01

# Generate a ~1GB file (Default if no size specified is 1GB)
npx ts-node src/index.ts
```

The output file `big-data.csv` will be created in the project root.

### Build

To compile the TypeScript code to JavaScript:

```bash
npm run build
```

## Testing

The project uses **Jest** for testing. To run the test suite:

```bash
npm test
```

This will execute the E2E tests which verify that the CSV file is generated correctly with the expected structure and size.

## Project Structure

- `src/core/CsvGenerator.ts`: Main logic for generating CSV data.
- `src/config/AppConfig.ts`: Configuration settings (file size, buffer size, etc.).
- `src/utils/Logger.ts`: Simple logging utility.
- `src/tests/`: Contains Jest test files.
- `src/index.ts`: Entry point of the application.

## Recent Changes

- **Removed `faker` dependency**: Switched to manual data generation to reduce package size and complexity.
- **Added Jest**: Replaced manual test scripts with a proper Jest test harness.
