import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    description: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    paymentMethod: {
        type: String,
        enum: ['Cash', 'Credit Card', 'Debit Card'],
        default: 'cash'
    },
    tags: [{  
        type: String   // tags of expenses e.g . 'rent', 'food', etc.we

    }]
}, { timestamps: true });

const Expense = mongoose.models.Expense || mongoose.model('Expense', expenseSchema);
export default Expense;