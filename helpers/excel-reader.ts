import * as XLSX from 'xlsx';
import * as fs from 'fs';

export interface RowData {
  [key: string]: any; 
}

export function readExcelFile(filePath: string): void {
  try {
    // Read the Excel file
    const fileBuffer = fs.readFileSync(filePath);
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

    // Assume we're working with the first worksheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convert the worksheet to JSON, including all rows
    const jsonData: RowData[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // Skip the header row (first row) and store the remaining rows in a variable
    const dataRows = jsonData.slice(1); // Everything except the header row

    // Get the header row to use as keys for column names
    const headers: string[] = jsonData[0] as string[];

    // Iterate through the rows and print data for each column
    dataRows.forEach((row, rowIndex) => {
      console.log(`Row ${rowIndex + 1}:`);
      const rowData = row as any[]; // Cast to array for indexing
      headers.forEach((header, colIndex) => {
        const value = rowData[colIndex] ?? 'N/A'; // Handle undefined/null values
        console.log(`  ${header}: ${value}`);
      });
      console.log('---');
    });

  } catch (error) {
    console.error('Error reading Excel file:', error);
  }
}
