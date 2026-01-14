 export interface IncidentHistoryItem {
    id: number;
    title: string;
    description: string;
    status: string;
    createdAt: string;
    closedAt: string | null;
    changeLog: string;
    changedAt: string;
    userName: string;
    workerName: string | null;
    companyName: string;
}