import type { incidentStatus } from './incidentStatus';
export type IncidentType = {
  IncidentsID: number;
  title: string;
  description: string;
  reportedByUserID: string | null;
  createdAt: Date;


  status: incidentStatus;
  priority: string;
};
