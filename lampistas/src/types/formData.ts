import type { ItemType } from '../types/itemType';
export type FormData = {
    clientName: string;
    clientEmail: string;
    clientID: number;
    date: string;
    items: ItemType[];
    budgetNumber: string;
    companyName: string;
    incidentID: number;
    subtotal: number;
    tax: number;
    totalAmmount: number;
};