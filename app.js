import express from "express";
import mongoose from "mongoose";
import authRoute from "./routes/user.js";
import coffeeRoute from "./routes/coffee.js";
import paymentRoute from "./routes/payment.js";
import accountRoute from "./routes/account.js";
// import dot_env from "dotenv";
// dot_env.config();
import cors from "cors";
const app = express();
// express middlewares
app.use(express.json());
app.use(cors("*"));

// routes middleware
app.use("/user", authRoute);
app.use("/coffee", coffeeRoute);
app.use("/payment", paymentRoute);
app.use("/account", accountRoute);

// db connection
mongoose
  // .connect(`mongodb+srv://kelvin:kelvin@45@cluster0.1gwwr.mongodb.net/ItheMutiki?retryWrites=true&w=majority`)
  .connect("mongodb+srv://kelvin:ebXrqHHd4QuVvMFr@cluster0.1gwwr.mongodb.net/ItheMutiki?retryWrites=true&w=majority")
  .then(() => console.log("Database connected succesfully"))
  .catch((err) => console.log(err));

// server setup
const PORT = 4000;
app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
