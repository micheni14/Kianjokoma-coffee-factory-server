import Account from "../models/account.js";
// create account
export const createAccount = async (req, res) => {
  const { account_name, account_balance } = req.body;
  try {
    // find existing account
    const existingAcc = await Account.findOne();
    if (existingAcc.isCreated)
      return res
        .status(409)
        .json({ message: "Error!You cannot have two accounts" });
    await Account.create({
      account_name,
      isCreated: true,
      account_balance,
    });
    return res.status(200).json({ message: "Account successfully created" });
  } catch (error) {
    res.status(500).json(error);
  }
};
// deposit funds in the factory account
export const deposit = async (req, res) => {
  const { deposit_amount } = req.body;
  try {
    if (!deposit_amount)
      return res.status(404).json({ message: "Deposit amount is required" });
    const depositFunds = await Account.findOneAndUpdate(
      {},
      { $inc: { account_balance: deposit_amount } },
      { new: true }
    );
    return res.status(200).json({
      message: `You have succesfully deposited Ksh ${deposit_amount}`,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};
// find account balance
export const getAccDetails = async (req, res) => {
  try {
    const account = await Account.findOne();
    return res.status(200).json(account);
  } catch (error) {
    return res.status(500).json(error);
  }
};
