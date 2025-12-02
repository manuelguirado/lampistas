import type { incidentStatus } from './incidentStatus';
export type IncidentType = {
  IncidentsID: number;
  title: string;
  description: string;
  reportedByUserID: number;
  dateReported: Date;

  status: incidentStatus;
  priority: string;
};
