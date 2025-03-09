import { test } from '@playwright/test';
import * as XLSX from 'xlsx';
import * as path from 'path';

// // 1. Read the Excel file and parse its first sheet
// const absoluteFilePath = path.join(__dirname, '../test-data/ComparisonRulesTest.xlsx');
// console.log('Reading from:', absoluteFilePath);

// const workbook = XLSX.readFile(absoluteFilePath);
// //const workbook = XLSX.readFile('./loginData.xlsx'); // Adjust path as needed
// const sheetName = workbook.SheetNames[0]; // e.g., "Sheet1"
// const worksheet = workbook.Sheets[sheetName];

// 2. Convert sheet to JSON (array of objects)
interface ComparissonData {
  testcases: string;
  ruleid: string;
  testcasesummary: string;
  requestfilename: string;
  statuscode: string;
  expectederrordescription: string;
  expectederrorcode: string;
  expectedresult: string;
  actualresult : string;
  tcresult : string;
}
let testData: ComparissonData[];
const TOTAL_WORKERS = 4;
//const testData: ComparissonData[] = XLSX.utils.sheet_to_json<ComparissonData>(worksheet);

function readExcelFile(): ComparissonData[] {
  // Read the Excel file
  const absoluteFilePath = path.join(__dirname, '../test-data/ComparisonRulesTest.xlsx');
  console.log('Reading from:', absoluteFilePath);

  const workbook = XLSX.readFile(absoluteFilePath);
  // Get the first sheet name
  const sheetName = workbook.SheetNames[0];
  // Get the worksheet
  const worksheet = workbook.Sheets[sheetName];
  // Convert sheet to JSON (array of objects)
  const data = XLSX.utils.sheet_to_json<ComparissonData>(worksheet);
  return data;
}

// Split data based on worker index
test.beforeAll(async ({}, testInfo) => {
  testData = readExcelFile();
  const workerIndex = testInfo.workerIndex;
  const chunkSize = Math.ceil(testData.length / TOTAL_WORKERS);
  const start = workerIndex * chunkSize;
  const end = Math.min(start + chunkSize, testData.length);
  testInfo['workerData'] = testData.slice(start, end); // Attach subset to testInfo
});

test('Run test with Excel data', async ({}, testInfo) => {
  const workerData: ComparissonData[] = testInfo['workerData'] as ComparissonData[];
  for (const row of workerData) {
      console.log('testcases:', row['testcases'] as string);
    }
  }
);


// test.describe('Rules Tests', () => {

//   testData = readExcelFile();
//   //test.describe.configure({ mode: 'parallel' });
  
//   testData.forEach(({ testcases, ruleid,testcasesummary, requestfilename,statuscode,expectederrordescription,expectederrorcode,expectedresult,actualresult,tcresult}, index) => {
//     test(`(${index + 1}) - read from excel - ${testcases} and ${ruleid} and ${requestfilename}`, async ({}) => {
      
//       console.log(`Running test (${index + 1}) on worker: ${test.info().workerIndex}`);
//       console.log('testcases:', testcases);
//     });
//   });
// });
