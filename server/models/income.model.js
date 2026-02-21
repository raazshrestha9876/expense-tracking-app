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
    category: {
      type: String,
      ref: "Category",
      required: true,
    },
    source: {
      type: String, 
    },
    tags: [
      {
        type: String, 
      },
    ],
  },
  { timestamps: true }
);

const Income = mongoose.models.Income || mongoose.model("Income", incomeSchema);
export default Income;
