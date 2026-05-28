import { ReportType } from '../enums/ReportType.js';

interface ReportCriteriaDTOData {
  since?: Date | number | null;
  until?: Date | number | null;
  type?: ReportType | null;
  id?: number | null;
}

export interface ReportCriteriaDTO extends Readonly<ReportCriteriaDTOData> {}

export function createReportCriteriaDTO(data: ReportCriteriaDTOData = {}): ReportCriteriaDTO {
  return Object.freeze({
    since: null,
    until: null,
    type: null,
    id: null,
    ...data,
  });
}
