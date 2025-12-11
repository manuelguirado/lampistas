import { z } from 'zod';

const now = Date.now();
const dateTime = z.preprocess(
  (arg) => {
    if (typeof arg === 'string' || arg instanceof Date) {
      const date = new Date(arg);
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
    return arg;
  },
  z.date().refine((date) => date.getTime() >= now, { message: 'Date must not be in the past' })
);


export const itemSchema = z.object({
    description: z.string().min(1, 'Description is required'),
    quantity: z.number().min(0, 'Quantity must be at least 0'),
    unitPrice: z.number().min(0, 'Unit price must be at least 0'),
    total: z.number().optional(),
});


export const budgetFormSchema = z.object({
    budgetNumber: z.string().min(1, 'Budget number is required'),
    companyName: z.string().min(1, 'Company name is required'),
    title: z.string().min(1, 'Title is required'),
    clientID: z.number().min(1, 'Client ID is required'),
    incidentID: z.number().optional(),
    date: z.string().min(1, 'Date is required'), // Usar string para input type="date"
    items: z.array(itemSchema).min(1, 'At least one item is required'),
    subtotal: z.number().optional(),
    tax: z.number().optional(),
    totalAmmount: z.number().optional(),
});


export const itemsSchema = z.object({
    body: z.object({
        description: z.string().min(1, 'Description is required'),
        quantity: z.number().min(1, 'Quantity must be at least 1'),
        unitPrice: z.number().min(0, 'Unit price must be at least 0'),
        total: z.number().min(0, 'Total must be at least 0'),
    })
});

export const budgetSchema = z.object({
    body: z.object({
        budgetNumber: z.string().min(1, 'Budget number is required'),
        companyName: z.string().min(1, 'Company name is required'),
        clientName: z.string().min(1, 'Client name is required'),
        incidentID: z.number().optional(),
        clientEmail: z.string().email('Invalid email address'),
        date: dateTime,
        items: z.array(itemsSchema).min(1, 'At least one item is required'),
        subtotal: z.number().min(0, 'Subtotal must be at least 0'),
        tax: z.number().min(0, 'Tax must be at least 0'),
        totalAmmount: z.number().min(0, 'Total amount must be at least 0'),
    })
});

// Tipos inferidos
export type BudgetFormData = z.infer<typeof budgetFormSchema>;
export type ItemFormData = z.infer<typeof itemSchema>;


