import mongoose from "mongoose";

const incomeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    source: {
      type: String,  //source of income e.g., company or person
    },
    tags: [
      {
        type: String, // tags for income e.g., rent, salary, etc.
      },
    ],
  },
  { timestamps: true }
);

const Income = mongoose.models.Income || mongoose.model("Income", incomeSchema);
export default Income;
