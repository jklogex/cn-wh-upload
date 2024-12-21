import { ProcessedFile } from "@/lib/types/file";
import { SheetMapping } from "@/components/mapping/sheet-mapping";

async function getFileData(fileId: string): Promise<ProcessedFile> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/files/${fileId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch file data');
  }
  return response.json();
}

export default async function MappingPage({
  params,
}: {
  params: { fileId: string };
}) {
  const fileData = await getFileData(params.fileId);

  return (
    <div className="container mx-auto py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Column Mapping</h1>
          <p className="text-muted-foreground mt-2">
            Map columns from {fileData.filename}
          </p>
        </div>

        <div className="space-y-6">
          {fileData.sheets.map((sheet) => (
            <SheetMapping
              key={sheet.id}
              sheetId={sheet.id}
              sheetName={sheet.name}
              data={sheet.data}
            />
          ))}
        </div>
      </div>
    </div>
  );
}