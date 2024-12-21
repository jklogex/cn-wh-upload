"use client";

import { useState } from "react";
import { SheetData } from "@/lib/types/file";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface SheetMappingProps {
  sheetId: number;
  sheetName: string;
  data: SheetData;
}

export function SheetMapping({ sheetId, sheetName, data }: SheetMappingProps) {
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const { toast } = useToast();

  const handleSaveMapping = async () => {
    try {
      const response = await fetch(`/api/sheets/${sheetId}/mapping`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ columns: selectedColumns }),
      });

      if (!response.ok) {
        throw new Error("Failed to save mapping");
      }

      toast({
        title: "Success",
        description: "Column mapping saved successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save column mapping",
      });
    }
  };

  return (
    <div className="rounded-lg border bg-card p-6">
      <h3 className="text-lg font-semibold mb-4">{sheetName}</h3>
      
      <div className="space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Column Name</th>
                <th className="text-left p-2">Sample Data</th>
              </tr>
            </thead>
            <tbody>
              {data.headers.map((header, index) => (
                <tr key={header} className="border-b">
                  <td className="p-2">{header}</td>
                  <td className="p-2">
                    {data.preview[0]?.[header]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Button onClick={handleSaveMapping}>
          Save Mapping
        </Button>
      </div>
    </div>
  );
}