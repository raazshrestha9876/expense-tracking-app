export interface Expense {
    amount: number,
    description: string,
    category: string,
    paymentMethod: 'Cash' | 'Credit Card' | 'Debit Card',
    tags: string[]
}
