"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
import { FileUploadInput, fileUploadSchema } from "@/lib/types/file";
import { getSheetNames } from "@/lib/utils/excel";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";

export function FileUpload() {
  const [availableSheets, setAvailableSheets] = useState<string[]>([]);
  const { toast } = useToast();
  
  const form = useForm<FileUploadInput>({
    resolver: zodResolver(fileUploadSchema),
    defaultValues: {
      selectedSheets: [],
    },
  });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      const file = acceptedFiles[0];
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
  }, [form, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    maxFiles: 1,
  });

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

      toast({
        title: "Success",
        description: "File uploaded successfully",
      });

      // Reset form
      form.reset();
      setAvailableSheets([]);
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
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive ? "border-primary bg-primary/5" : "border-border"}`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            {isDragActive
              ? "Drop the Excel file here"
              : "Drag and drop an Excel file here, or click to select"}
          </p>
          {form.watch("file") && (
            <p className="mt-2 text-sm font-medium">
              Selected: {form.watch("file").name}
            </p>
          )}
        </div>

        {availableSheets.length > 0 && (
          <FormField
            control={form.control}
            name="selectedSheets"
            render={() => (
              <FormItem>
                <FormLabel>Select sheets to process</FormLabel>
                <div className="space-y-2">
                  {availableSheets.map((sheet) => (
                    <FormField
                      key={sheet}
                      control={form.control}
                      name="selectedSheets"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(sheet)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([...field.value, sheet]);
                                } else {
                                  field.onChange(
                                    field.value?.filter((value) => value !== sheet)
                                  );
                                }
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            {sheet}
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
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