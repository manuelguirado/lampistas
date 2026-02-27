export interface Company {
    companyID: number;
    name: string;
    email: string;
    phone: string;
    directions: {address: string, city: string, state: string, zipCode: string}[];
}
