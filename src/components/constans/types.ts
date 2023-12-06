
export interface SignupData {
    name: string;
    email: string;
    password: string;
    confirm: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface IncomeData {
    id: string;
    monthIncome: number;
    monthName: string;
    year: number;
}

export interface ExpensesData {
    [x: string]: any;
    created_at: string;
    id: string;
    productCategory: string;
    productId: string;
    productPrice: number;
}

export interface AddMonthData {
    month: string;
    income: number;
}