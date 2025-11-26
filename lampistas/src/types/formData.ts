import type { ItemType } from './itemType';

export type FormData = {
  budgetNumber: string;
  companyName: string;
  clientName: string;
  clientEmail: string;
  clientID: number;
  date: string;
  items: ItemType[];
  incidentID?: number;
  subtotal: number;
  tax: number;
  totalAmmount: number;
};