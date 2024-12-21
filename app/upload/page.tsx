import { FileUpload } from "@/components/upload/file-upload";

export default function UploadPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Excel File Processor</h1>
          <p className="text-muted-foreground mt-2">
            Upload and process your Excel files
          </p>
        </div>

        <div className="grid gap-8">
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Upload Excel File</h2>
            <FileUpload />
          </div>
        </div>
      </div>
    </div>
  );
}