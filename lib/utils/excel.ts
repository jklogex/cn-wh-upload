import * as XLSX from 'xlsx';

export async function getSheetNames(file: File): Promise<string[]> {
  try {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer);
    return workbook.SheetNames;
  } catch (error) {
    console.error('Error reading Excel file:', error);
    throw new Error('Failed to read Excel file');
  }
}

export async function getSheetData(file: File, sheetName: string) {
  try {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer);
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    const headers = data[0] as string[];
    const preview = data.slice(1, 6).map(row => {
      const obj: Record<string, any> = {};
      headers.forEach((header, index) => {
        obj[header] = row[index];
      });
      return obj;
    });

    return { headers, preview };
  } catch (error) {
    console.error('Error processing sheet:', error);
    throw new Error('Failed to process sheet');
  }
}