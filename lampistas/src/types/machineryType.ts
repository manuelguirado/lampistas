export interface MachineryType {
  machineryID: number;
  name: string;
  description: string;
  brand: string;
  model: string;
  clientID?: number;
  serialNumber: string;
  maintenanceDate?: Date;
  lastInspectionDate?: Date;
  installedAT?: Date;
  companyName: string;
  machineType: string;
}
