import Report from "../models/Report.js";
import Tracking from "../models/Tracking.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { buildPdfReport, buildCsvReport, buildExcelReport } from "../utils/exporters.js";

// @route GET /api/reports
export const getReportHistory = asyncHandler(async (req, res) => {
  const reports = await Report.find({ user: req.user._id }).sort({ createdAt: -1 }).lean();
  res.status(200).json({ success: true, data: reports });
});

// @route POST /api/reports/export
// Body: { format: "pdf"|"csv"|"excel", startDate, endDate, range }
// Streams the generated file directly back to the client.
export const exportReport = asyncHandler(async (req, res) => {
  const { format, startDate, endDate, range = "custom" } = req.body;
  if (!["pdf", "csv", "excel"].includes(format)) throw new ApiError(400, "Invalid export format");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate || "") || !/^\d{4}-\d{2}-\d{2}$/.test(endDate || "")) {
    throw new ApiError(400, "Valid startDate and endDate are required");
  }
  if (startDate > endDate) throw new ApiError(400, "startDate must be before endDate");

  const entries = await Tracking.find({
    user: req.user._id,
    date: { $gte: startDate, $lte: endDate },
  }).select("date domain durationSeconds visitCount").sort({ date: 1 }).lean();

  await Report.create({ user: req.user._id, format, range, startDate, endDate });

  if (format === "pdf") {
    const buffer = await buildPdfReport({ user: req.user, startDate, endDate, entries });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=focustrack-report.pdf`);
    return res.send(buffer);
  }

  if (format === "csv") {
    const csv = buildCsvReport(entries);
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename=focustrack-report.csv`);
    return res.send(csv);
  }

  // excel
  const buffer = await buildExcelReport(entries);
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", `attachment; filename=focustrack-report.xlsx`);
  return res.send(Buffer.from(buffer));
});
