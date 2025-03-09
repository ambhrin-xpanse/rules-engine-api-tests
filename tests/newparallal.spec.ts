import { test } from '@playwright/test';
import * as XLSX from 'xlsx';
import * as path from 'path';

// Define the interface for your data
interface ComparissonData {
  ruleid: string;
  testcases?: string; // Optional, since you mentioned it
  [key: string]: string | number | undefined; // Flexible for other columns
}

let testData: ComparissonData[];
const TOTAL_WORKERS = 4;

function readExcelFile(): ComparissonData[] {
  const absoluteFilePath = path.join(__dirname, '../test-data/ComparisonRulesTest.xlsx');
  console.log('Reading from:', absoluteFilePath);

  const workbook = XLSX.readFile(absoluteFilePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json<ComparissonData>(worksheet);
  console.log('Total rows read:', data.length);
  console.log('First row:', data[0]);
  return data;
}

test.beforeAll(async ({}, testInfo) => {
testData = readExcelFile();
  console.log('testData length:', testData.length);
  const workerIndex = testInfo.workerIndex;
  const chunkSize = Math.ceil(testData.length / TOTAL_WORKERS);
  const start = workerIndex * chunkSize;
  const end = Math.min(start + chunkSize, testData.length);
  console.log(`Worker ${workerIndex}: chunkSize=${chunkSize}, Start=${start}, End=${end}`);
  testInfo['workerData'] = testData.slice(start, end);
  console.log('Assigned workerData length:', testInfo['workerData'].length);
});

test('Run tests with Excel data', async ({}, testInfo) => {
  const workerData: ComparissonData[] = testInfo['workerData'] as ComparissonData[];
  for (const row of workerData) {
    console.log('ruleid:', row['ruleid'] as string);
  }
});
