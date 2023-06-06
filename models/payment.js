import mongoose from "mongoose";
const schema = mongoose.Schema;
const paymentSchema = schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    farmerId: {
      type: String,
      required: [true, "Farmer id is required"],
    },
    quantity: {
      type: Number,
      default: 0,
      required: [true, "Quantity is required"],
    },
    amount: {
      type: Number,
      default: 0,
      required: [true, "Amount is required"],
    },
    phone: {
      type: Number,
      required: [true, "phone number is required"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("payment", paymentSchema);
