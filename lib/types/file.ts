import { z } from "zod";

export const fileUploadSchema = z.object({
  file: z.instanceof(File),
  selectedSheets: z.array(z.string()).min(1, "Select at least one sheet"),
});

export type FileUploadInput = z.infer<typeof fileUploadSchema>;

export interface SheetData {
  headers: string[];
  preview: Record<string, any>[];
}

export interface ProcessedFile {
  id: number;
  filename: string;
  sheets: {
    id: number;
    name: string;
    data: SheetData;
  }[];
}