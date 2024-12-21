import { getCurrentUser } from "@/lib/auth";
import { FileUpload } from "@/components/dashboard/file-upload";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  return (
    <div className="container mx-auto py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
          <p className="text-muted-foreground mt-2">
            Upload and manage your inventory data
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