import { useQuery } from "@tanstack/react-query";
import { getReport } from "@/lib/actions/report.actions";
import type { ReportParams, ReportResponse } from "./report.dto";

export function useReport(params: ReportParams) {
  return useQuery<ReportResponse>({
    queryKey: ["report", params],
    queryFn: () => getReport(params),
    enabled: !!params.scope, // Only runs if scope is set
  });
}
