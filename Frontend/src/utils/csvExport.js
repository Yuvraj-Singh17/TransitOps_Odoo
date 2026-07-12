import Papa from "papaparse";
import { saveAs } from "file-saver";

// Usage: exportToCSV(data, "vehicle-roi-report")
export function exportToCSV(data, filename = "report") {
  if (!data || data.length === 0) {
    console.warn("No data to export");
    return;
  }
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, `${filename}-${new Date().toISOString().slice(0, 10)}.csv`);
}