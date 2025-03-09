import { test } from '@playwright/test';
import * as XLSX from 'xlsx';
import * as path from 'path';

// 1. Read the Excel file and parse its first sheet
const absoluteFilePath = path.join(__dirname, '../test-data/ComparisonRulesTest.xlsx');
console.log('Reading from:', absoluteFilePath);

const workbook = XLSX.readFile(absoluteFilePath);
//const workbook = XLSX.readFile('./loginData.xlsx'); // Adjust path as needed
const sheetName = workbook.SheetNames[0]; // e.g., "Sheet1"
const worksheet = workbook.Sheets[sheetName];

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

const testData: ComparissonData[] = XLSX.utils.sheet_to_json<ComparissonData>(worksheet);

// 3. Use `test.describe` to group data-driven tests
test.describe('Rules Tests', () => {

  test.describe.configure({ mode: 'parallel' });
  // 4. For each row in `testData`, create an individual test
  testData.forEach(({ testcases, ruleid,testcasesummary, requestfilename,statuscode,expectederrordescription,expectederrorcode,expectedresult,actualresult,tcresult}, index) => {
    test(`(${index + 1}) - read from excel - ${testcases} and ${ruleid} and ${requestfilename}`, async ({}) => {
      
      console.log(`Running test (${index + 1}) on worker: ${test.info().workerIndex}`);

      console.log('testcases:', testcases);
      // console.log('ruleid:', ruleid);
      // console.log('testcasesummary:', testcasesummary);
      // console.log('requestfilename:', requestfilename);
      // console.log('statuscode:', statuscode);
      // console.log('expectederrordescription:', expectederrordescription);
      // console.log('expectederrorcode:', expectederrorcode);
      // console.log('expectedresult:', expectedresult);
      // console.log('actualresult:', actualresult);
      // console.log('tcresult:', tcresult);
    });
  });
}
);
