import reportInterceptor from "@/api/report/inceptor";
import type { ReportParams, ReportResponse } from "@/api/report/report.dto";


export async function getReport(params: ReportParams): Promise<ReportResponse> {
  const { data } = await reportInterceptor.get("", { params });
  return data;
}
