import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Coffee from "../models/coffee.js";
import dot_env from "dotenv";
import Payment from "../models/payment.js";
import bcrypt from "bcrypt";
dot_env.config();
// register user
export const register = async (req, res) => {
  const { firstname, lastname, role, email, password, phone_number, gender } =
    req.body;
  try {
    // assign a user a random id
    const userId = Math.floor(1000 + Math.random() * 9000);

    // check if the user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json(`Sorry ${email} already exists`);
    }
    // hash user password
    const hashedPassword = await bcrypt.hash(password, 10);
    // store data in the database
    await User.create({
      firstname,
      lastname,
      role,
      email,
      password: hashedPassword,
      phone_number,
      gender,
      farmerId: userId,
    });
    // generate  and asign token to the registered user
    // query the new specific user
    const newUser = await User.findOne({ email });
    const token = jwt.sign({ id: newUser._id }, process.env.REGISTER_SECRET);
    res.status(200).json({ message: "Succesfully registered", token });
  } catch (error) {
    res.status(500).json(error);
  }
};
// login user
export const login = async (req, res) => {
  // res.send("Login route");
  const { email, password } = req.body;
  try {
    // check if given email and password matches the one in the db
    const existingUser = await User.findOne({ email });
    // check if passwords match
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect)
      return res.status(409).json("Invalid credentials !!.Try again");

    // generate and assign login token
    const token = jwt.sign({ id: existingUser._id }, process.env.login_secret, {
      expiresIn: "20 days",
    });
    // const role = existingUser.role;
    res
      .status(200)
      .json({ message: "successfully logged in", token, existingUser });
  } catch (error) {
    res.status(500).json(error);
  }
};
// upload farmers coffee
export const uploadFarmerCoffee = async (req, res) => {
  const { farmerId } = req.params;
  try {
    const uploadedCoffee = await Coffee.create(req.body);
    const foundFarmer = await User.findOneAndUpdate(
      { _id: farmerId, role: "farmer" },
      {
        $push: {
          coffeeDetails: uploadedCoffee._id,
        },
      },
      {
        new: true,
      }
    ).populate("coffeeDetails");
    if (!foundFarmer)
      return res
        .status(400)
        .json({ message: "Failed.The user is not a farmer" });
    // store all the values under quantity key to an array
    const qtyArr = await foundFarmer?.coffeeDetails?.map((weight) => {
      return parseInt(weight?.quantity);
    });
    // do the sumation of the weight
    const totalWeight = qtyArr.reduce((a, b) => {
      return a + b;
    });
    // value of the coffee
    const totalValue = totalWeight * process.env.RATE;
    // update Kilo field after upload
    const populatedFarmer = await User.findByIdAndUpdate(
      {
        _id: farmerId,
      },
      { $set: { totalKilos: totalWeight, value: totalValue } },
      { new: true }
    );
    const returnedFarmer = {
      // coffeeDetails: populatedFarmer.coffeeDetails,
      farmer: populatedFarmer?.firstname.concat(" ", populatedFarmer?.lastname),
      message: "Succesfully uploaded",
    };
    return res.status(200).json(returnedFarmer);
  } catch (error) {
    res.status(500).json(error);
  }
};

// get specific farmer
export const specificFarmer = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById({ _id: id })
      .populate("coffeeDetails")
      .populate("paymentRecord");
    //user.find({ arrayElementName: { $exists: true, $size: 0 } });
    // check if the array has data
    const coffeeDetailsArr = user?.coffeeDetails;
    if (coffeeDetailsArr?.length == 0) {
      // console.log("EMPTY");
      return res.status(200).json(user);
    } else {
      return res.status(200).json(user);
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};
// get all farmers
export const getAllFarmers = async (req, res) => {
  // const{}
  try {
    const farmers = await User?.find({ role: "farmer" }).populate(
      "coffeeDetails"
    );
    res.status(200).json(farmers);
  } catch (error) {
    res.status(500).json(error.message);
  }
};
// get all staff
export const getAllStaff = async (req, res) => {
  // const{}
  try {
    const staff = await User?.find({ role: "Staff" });
    res.status(200).json(staff);
  } catch (error) {
    res.status(500).json(error.message);
  }
};
// get user profile
export const getUserProfile = async (req, res) => {
  try {
    const token = req.header("Authorization").split(" ")[1];
    const decoded = jwt.verify(token, process.env.LOGIN_SECRET);
    const currentUser = await User.findOne({ _id: decoded.id })
      .populate("coffeeDetails")
      .populate("paymentRecord")
      .populate("requestData");
    // check if the array has data
    const coffeeDetailsArr = currentUser?.coffeeDetails;
    if (coffeeDetailsArr?.length == 0) {
      return res.status(200).json(currentUser);
    } else {
      return res.status(200).json(currentUser);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

// forgot password
export const forgotPassword = async (req, res) => {
  const { email, password } = req.body;
  try {
    // ensure the user exists
    const existingUser = await User.findOne({ email });
    if (!existingUser)
      return res.status(404).json({ message: `${email} does not exist` });
    // hash user password
    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: { password: hashedPassword } },
      { new: true }
    );
    res.status(200).json({
      message: "You have successfully reset your password",
      updatedUser,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};
// delete user
export const deleteUser = async (req, res) => {
  const { user_id } = req.params;
  try {
    // search user
    const foundUser = await User.findByIdAndDelete({ _id: user_id });
    res.status(200).json({ message: "User succesfully deleted" });
  } catch (error) {
    res.status(500).json(error);
  }
};
// update user details
export const userUpdate = async (req, res) => {
  const { user_id } = req.params;
  const { firstname, lastname, phone_number, gender } = req.body;
  try {
    const existingUser = await User.findById({ _id: user_id });
    // if (!existingUser)
    //   return res.status(403).json({ message: "User does not exist" });
    // hash user password
    // const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser = await User.findOneAndUpdate(
      {
        _id: existingUser._id,
      },
      {
        $set: { firstname, lastname, phone_number, gender },
      },
      { new: true }
    );
    return res.status(200).json({ message: "User successfully updated" });
  } catch (error) {
    res.status(500).json(error);
  }
};

// Search farmers
export const searchUser = async (req, res) => {
  try {
    const foundUser = await User.aggregate([
      {
        $search: {
          index: "default",
          text: {
            query: req.params.searchText,
            path: {
              wildcard: "*",
            },
          },
        },
      },
    ]);
    if (foundUser.length == 0)
      return res.status(404).json({ message: "No results found" });
    return res.status(200).json(foundUser);
  } catch (error) {
    return res.status(500).json(error);
  }
};
