"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { FileUploadInput, fileUploadSchema } from "@/lib/types/file";
import { getSheetNames } from "@/lib/utils/excel";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Dropzone } from "./dropzone";
import { SheetSelector } from "./sheet-selector";

export function FileUpload() {
  const [availableSheets, setAvailableSheets] = useState<string[]>([]);
  const { toast } = useToast();
  const router = useRouter();
  
  const form = useForm<FileUploadInput>({
    resolver: zodResolver(fileUploadSchema),
    defaultValues: {
      selectedSheets: [],
    },
  });

  const handleFileSelect = async (file: File) => {
    try {
      const sheets = await getSheetNames(file);
      setAvailableSheets(sheets);
      form.setValue("file", file);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process Excel file",
      });
    }
  };

  async function onSubmit(data: FileUploadInput) {
    try {
      const formData = new FormData();
      formData.append("file", data.file);
      formData.append("sheets", JSON.stringify(data.selectedSheets));

      const response = await fetch("/api/files/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const result = await response.json();

      toast({
        title: "Success",
        description: "File uploaded successfully",
      });

      router.push(`/mapping/${result.fileId}`);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload file",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Dropzone onFileSelect={handleFileSelect} />
        
        {form.watch("file") && (
          <p className="text-sm font-medium">
            Selected: {form.watch("file").name}
          </p>
        )}

        {availableSheets.length > 0 && (
          <FormField
            control={form.control}
            name="selectedSheets"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select sheets to process</FormLabel>
                <SheetSelector
                  sheets={availableSheets}
                  selectedSheets={field.value}
                  onSheetSelect={(sheets) => field.onChange(sheets)}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button
          type="submit"
          disabled={!form.watch("file") || !form.watch("selectedSheets").length}
        >
          Upload and Process
        </Button>
      </form>
    </Form>
  );
}