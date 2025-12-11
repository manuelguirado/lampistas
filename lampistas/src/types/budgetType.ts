export interface BudgetType {
  budgetID?: number;
    incidentID: number;
  companyID: string;
title: string;

  description: string;
  totalAmount: number;
  status: 'pending' | 'approved' | 'rejected';
  items ?: Array<{
    itemID: string;
    description: string;
    quantity: number;
    total: number;
 
  }>;
  createdAt?: Date;

}