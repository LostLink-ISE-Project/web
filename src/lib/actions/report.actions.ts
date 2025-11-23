import reportInterceptor from "@/api/report/inceptor";
import type { PublicReportParams, PublicReportResponse, ReportParams, ReportResponse } from "@/api/report/report.dto";


export async function getReport(params: ReportParams): Promise<ReportResponse> {
  const { data } = await reportInterceptor.get("", { params });
  return data;
}

export async function getPublicReport(params: PublicReportParams): Promise<PublicReportResponse> {
  const { period } = params || {};
  const res = await reportInterceptor.get<PublicReportResponse>("/public", {
    params: period ? { period } : undefined,
  });
  return res.data;
}