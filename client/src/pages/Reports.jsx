import { useState } from "react";
import { format, subDays } from "date-fns";
import toast from "react-hot-toast";
import { Download } from "lucide-react";
import Card from "../components/common/Card.jsx";
import Button from "../components/common/Button.jsx";
import { reportService } from "../services/reportService.js";

const FORMATS = [
  { value: "pdf", label: "PDF" },
  { value: "csv", label: "CSV" },
  { value: "excel", label: "Excel" },
];

// Reports page — export tracking data as PDF, CSV, or Excel.
export default function Reports() {
  const [format_, setFormat] = useState("pdf");
  const [range, setRange] = useState(7);
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const endDate = format(new Date(), "yyyy-MM-dd");
      const startDate = format(subDays(new Date(), range), "yyyy-MM-dd");

      const blob = await reportService.exportReport({ format: format_, startDate, endDate, range: "custom" });
      if (!(blob instanceof Blob) || blob.size === 0) throw new Error("The report was empty");

      // Trigger a browser download for the returned blob.
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `focustrack-report.${format_ === "excel" ? "xlsx" : format_}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Report downloaded");
    } catch (err) {
      let message = "Export failed";
      if (err.response?.data instanceof Blob) {
        try {
          const error = JSON.parse(await err.response.data.text());
          message = error.message || message;
        } catch {
          // Keep the generic message when the server did not return JSON.
        }
      } else if (err.response?.data?.message) {
        message = err.response.data.message;
      }
      toast.error(message);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Reports</h1>

      <Card title="Export Productivity Report">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:items-end">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Format</label>
            <select className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900" value={format_} onChange={(e) => setFormat(e.target.value)}>
              {FORMATS.map((f) => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Date Range</label>
            <select className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900" value={range} onChange={(e) => setRange(Number(e.target.value))}>
              <option value={1}>Daily (today)</option>
              <option value={7}>Weekly (7 days)</option>
              <option value={30}>Monthly (30 days)</option>
            </select>
          </div>
          <Button onClick={handleExport} disabled={exporting} className="flex items-center justify-center gap-2">
            <Download size={16} /> {exporting ? "Exporting..." : "Export"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
