export interface ReportParams {
  period?: string;
  scope: string;
}

export interface ReportResponse {
  ok: boolean;
  data: any; // Replace `any` with a proper shape if known
  message: string;
  status: number;
}

export interface PublicReportParams {
  period?: string; // "YYYY-MM-DD_YYYY-MM-DD" or undefined for "today"
}

export interface PublicReportResponse {
  ok: boolean;
  data: { found: number; claimed: number };
  message: string;
  status: number;
}