export type Contractype = 'FREE CHOICE' | ' CONTRACT';
export interface Contract {
   id: number;
    contractType: Contractype;
    startDate: string;
    endDate: string | null;
    isActive: boolean;
}