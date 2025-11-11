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
