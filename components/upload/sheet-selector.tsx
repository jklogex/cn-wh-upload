"use client";

import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

interface SheetSelectorProps {
  sheets: string[];
  selectedSheets: string[];
  onSheetSelect: (sheets: string[]) => void;
}

export function SheetSelector({ sheets, selectedSheets, onSheetSelect }: SheetSelectorProps) {
  return (
    <div className="space-y-2">
      {sheets.map((sheet) => (
        <FormItem key={sheet} className="flex items-center space-x-2">
          <FormControl>
            <Checkbox
              checked={selectedSheets.includes(sheet)}
              onCheckedChange={(checked) => {
                if (checked) {
                  onSheetSelect([...selectedSheets, sheet]);
                } else {
                  onSheetSelect(selectedSheets.filter((s) => s !== sheet));
                }
              }}
            />
          </FormControl>
          <FormLabel className="text-sm font-normal">{sheet}</FormLabel>
        </FormItem>
      ))}
    </div>
  );
}