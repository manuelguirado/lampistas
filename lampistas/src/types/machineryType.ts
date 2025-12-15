export interface MachineryType {
  machineryID: number;
  name: string;
  description: string;
  brand: string;
  model: string;
  clientID?: number;
  serialNumber: string;
  lastInspectionDate  ?: Date;
  installedAt?: Date;
  companyName: string;
  machineType: string;
}
