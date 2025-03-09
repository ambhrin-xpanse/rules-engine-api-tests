// tests/dataDrivenTest.spec.ts

import { test, expect } from '@playwright/test';
import * as XLSX from 'xlsx';
import * as path from 'path';

// 1. Read the Excel file and parse its first sheet
const absoluteFilePath = path.join(__dirname, '../test-data/loginData.xlsx');
console.log('Reading from:', absoluteFilePath);

const workbook = XLSX.readFile(absoluteFilePath);
//const workbook = XLSX.readFile('./loginData.xlsx'); // Adjust path as needed
const sheetName = workbook.SheetNames[0]; // e.g., "Sheet1"
const worksheet = workbook.Sheets[sheetName];

// 2. Convert sheet to JSON (array of objects)
interface LoginData {
  Username: string;
  Password: string;
}

const testData: LoginData[] = XLSX.utils.sheet_to_json<LoginData>(worksheet);

// 3. Use `test.describe` to group data-driven tests
test.describe('Data-driven Login Tests', () => {

  // 4. For each row in `testData`, create an individual test
  testData.forEach(({ Username, Password }) => {
    test(`should login with user: ${Username} and ${Password}`, async ({ page }) => {
      console.log('Username:', Username);
      console.log('Password:', Password);
    });
  });
});
