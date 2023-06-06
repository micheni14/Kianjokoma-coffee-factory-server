import Coffee from "../models/coffee.js";
import User from "../models/user.js";
import Payment from "../models/payment.js";
export const uploadUserCoffee = async (req, res) => {
  const { coffee_type, quantity, date_submitted, farmer } = req.body;
  try {
    const submittedCoffee = await Coffee.create({
      coffee_type,
      quantity,
      date_submitted,
    });
    res.status(200).json({ submittedCoffee, message: "succesfully submitted" });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getUserCoffeeDetails = async (req, res) => {
  try {
    const coffeeDetails = await Coffee.find();
    res.status(200).json(coffeeDetails);
  } catch (error) {
    res.status(500).json(error);
  }
};

// get total kgs paid
export const getTotalQuantityPaid = async (req, res) => {
  try {
    // get all the payments made
    const foundPayment = await Payment.find();
    // target quantity field and store in an array
    const totalQuantityArr = foundPayment.map((qty) => {
      return qty.quantity;
    });
    // add all the kilos
    const totalQuantityPaid = totalQuantityArr.reduce((a, b) => {
      return a + b;
    });
    // console.log("totalQuantityPaid is", totalQuantityPaid);

    res.status(200).json(totalQuantityPaid);
  } catch (error) {
    res.status(500).json(error);
  }
};

// get total quantity submkitted
export const getTotalQuantitySubmitted = async (req, res) => {
  try {
    // get all the users
    const foundUsers = await User.find({
      role: "farmer",
      totalKilos: { $gt: 0 },
    });
    // target quantity field and store in an array
    const totalQuantityArr = foundUsers.map((qty) => {
      return qty.totalKilos;
    });
    // add all the kilos
    // if (totalQuantityArr.length == 0)
    //   return res.status(404).json({ message: "O" });
    const totalQuantitySubmitted = totalQuantityArr.reduce((a, b) => {
      return a + b;
    });
    // console.log("totalQuantitySubmitted is", totalQuantitySubmitted);

    res.status(200).json(totalQuantitySubmitted);
  } catch (error) {
    res.status(500).json(error);
  }
};
