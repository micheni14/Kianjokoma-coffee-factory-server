import mongoose from "mongoose";
const schema = mongoose.Schema;
const userSchema = schema(
  {
    firstname: {
      type: String,
      required: [true, "Firstname is required"],
    },
    lastname: {
      type: String,
      required: [true, "Lastname is required"],
    },
    role: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    phone_number: {
      type: Number,
      required: [true, "Phone number is required"],
    },

    farmerId: {
      type: String,
      required: [true, "Farmer id is required"],
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
    },
    wallet: {
      type: Number,
      default: 0,
    },
    coffeeDetails: [
      {
        type: schema.Types.ObjectId,
        ref: "coffee",
      },
    ],
    totalKilos: {
      type: Number,
      default: 0,
    },
    value: {
      type: Number,
      default: 0,
    },
    paid: {
      type: Boolean,
      default: false,
    },
    requestData: [
      {
        type: schema.Types.ObjectId,
        ref: "request",
      },
    ],
    paymentRequest: {
      type: String,
      default: "not sent",
    },
    paymentRecord: [
      {
        type: schema.Types.ObjectId,
        ref: "payment",
      },
    ],
  },

  { timestamps: true }
);
export default mongoose.model("users", userSchema);
