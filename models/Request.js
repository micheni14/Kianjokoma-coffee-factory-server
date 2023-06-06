import mongoose, { Types } from "mongoose";
const schema = mongoose.Schema;
const RequestSchema = schema(
  {
    sender_name: {
      type: String,
      required: [true, "sender name is required"],
    },
    farmer_id: {
      type: String,
      required: [true, "Farmer id is required"],
    },
    request_amount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      default: "rejected",
    },
  },
  { timestamps: true }
);

export default mongoose.model("request", RequestSchema);
