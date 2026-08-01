import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";
import { Parser as CsvParser } from "json2csv";

// Builds a PDF report buffer summarizing tracking entries for a date range.
// Returns a Promise<Buffer> since pdfkit streams asynchronously.
export function buildPdfReport({ user, startDate, endDate, entries }) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40 });
    const chunks = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.fontSize(18).fillColor("#4f46e5").text("FocusTrack Productivity Report", { align: "left" });
    doc.moveDown(0.3);
    doc.fontSize(10).fillColor("#6b7280").text(`${user.name} · ${startDate} to ${endDate}`);
    doc.moveDown(1);

    const totalMinutes = Math.round(entries.reduce((s, e) => s + e.durationSeconds, 0) / 60);
    doc.fontSize(12).fillColor("#111827").text(`Total tracked time: ${totalMinutes} minutes`);
    doc.moveDown(1);

    doc.fontSize(12).fillColor("#111827").text("Website Breakdown", { underline: true });
    doc.moveDown(0.5);

    entries
      .sort((a, b) => b.durationSeconds - a.durationSeconds)
      .forEach((e) => {
        doc.fontSize(10).fillColor("#374151").text(`${e.date}  ·  ${e.domain}  ·  ${Math.round(e.durationSeconds / 60)} min`);
      });

    doc.end();
  });
}

// Builds a CSV string from tracking entries.
export function buildCsvReport(entries) {
  const parser = new CsvParser({ fields: ["date", "domain", "durationSeconds", "visitCount"] });
  return parser.parse(entries.map((e) => e.toObject ? e.toObject() : e));
}

// Builds an XLSX buffer from tracking entries.
export async function buildExcelReport(entries) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Tracking Report");

  sheet.columns = [
    { header: "Date", key: "date", width: 14 },
    { header: "Domain", key: "domain", width: 30 },
    { header: "Duration (min)", key: "minutes", width: 16 },
    { header: "Visits", key: "visitCount", width: 10 },
  ];

  entries.forEach((e) => {
    sheet.addRow({ date: e.date, domain: e.domain, minutes: Math.round(e.durationSeconds / 60), visitCount: e.visitCount });
  });

  sheet.getRow(1).font = { bold: true };
  return workbook.xlsx.writeBuffer();
}
