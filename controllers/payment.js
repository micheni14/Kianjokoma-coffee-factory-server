// import axios from "axios";

// export const getToken = async (req, res, next) => {
//   let consumerKey = "kM7M1oWDjo35LNSA5RiFTGw7HVgUbr4R";
//   let consumerSecrect = "elu0dUAbMkczj6Vw";
//   const reqUrl =
//     "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
//   let authToken =
//     "Basic " +
//     Buffer.from(consumerKey + ":" + consumerSecrect).toString("base64");
//   let headers = {
//     Authorization: authToken,
//   };
//   try {
//     const response = await axios.get(reqUrl, { headers: headers });
//     const data = await response?.data;
//     let token = data.access_token;
//     // res.send(token);
//     req.token = token;
//     next();
//     // console.log(token);
//   } catch (error) {
//     res.status(500).json(error);
//   }
// };

// export const MakePayment = async (req, res) => {
//   let token = req.token;
//   const paymentUrl =
//     "https://sandbox.safaricom.co.ke/mpesa/b2c/v1/paymentrequest";
//   let headers = {
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${token}`,
//   };
//   let reqBody = JSON.stringify({
//     InitiatorName: "testapi",
//     SecurityCredential:
//       "XhjI5j871d1mbUPMxOsNzQ2NUK0CmQ5fHLMNZF2uNwl79UedZctNIBO+JWDtbfV00ui6heW9JWv2IEfpBVqmMeulex/D3q9AnuyxKIc8MYGUzuVYgIH/Su0vZoTug3DTeXmBqccpu6IEWtfIMV+7ypXKugAlZtidsyrIdVQG2MaNswvod1ioM5IQNsyW+lOhFWZL7VyXyZ4jt9f4T1W9h96RwA6MwrdQs4b4Z2oE4UTrCdoIFeorYE2C1TKW9x8fA+P9JGJM2e6PyBsMl2yEVgKS2klU8qiJDsCQ1t+Rl9uWOorXdNICPAGcvU2LrOLm4/RgL9JbYHvCTvNFegQ1kQ==",
//     CommandID: "SalaryPayment",
//     Amount: 200,
//     PartyA: 600988,
//     PartyB: 254759761805,
//     Remarks: "Test remarks",
//     QueueTimeOutURL: "https://7270-102-217-120-90.eu.ngrok.io/payment/timeout",
//     ResultURL: "https://7270-102-217-120-90.eu.ngrok.io/payment/result",
//     Occassion: "christmass",
//   });
//   try {
//     const response = await axios.post(paymentUrl, reqBody, {
//       headers: headers,
//     });
//     const data = await response.data;
//     return res.status(200).json(data);
//   } catch (error) {
//     return res.status(500).json(error);
//   }
// };
// export const getResult = (req, res) => {
//   console.log("Result is", req.body);
// };
// export const getTimeout = (req, res) => {
//   console.log("Error is", req.body);
// };
import Payment from "../models/payment.js";
import Farmers from "../models/user.js";
import Account from "../models/account.js";
import dot_env from "dotenv";
import account from "../models/account.js";
import jwt from "jsonwebtoken";
import Requests from "../models/Request.js";
dot_env.config();

// filter payable farmers
export const getPayableFarmers = async (req, res) => {
  try {
    const payableFarmers = await Farmers.find({
      value: { $gt: 0 },
      role: "farmer",
    });

    return res.status(200).json(payableFarmers);
  } catch (error) {
    res.status(500).json(error);
  }
};

// //notifiy manager to pay all
export const notifyManager = async (req, res) => {
  try {
    // details of the staff making payment
    // const token = req.header("Authorization").split(" ")[1];
    // const decoded = jwt.verify(token, process.env.LOGIN_SECRET);
    // const currentUser = await Farmers.findOne({ _id: decoded.id });
    // let staff_name = `${currentUser.firstname} ${currentUser.lastname}`;
    Farmers.find(
      { value: { $gt: 0 }, role: "farmer" },
      async (err, farmers) => {
        if (farmers?.length == 0) {
          return res.status(404).json({
            message: "Failed! There is no payable farmer at the moment",
          });
        } else {
          // store total amount paid in array
          const totalPaidArr = farmers.map((farmer) => {
            return parseInt(farmer.value);
          });
          // add paid amounts in array
          const totalAmout = totalPaidArr.reduce((a, b) => {
            return a + b;
          });

          await Account.findOneAndUpdate(
            {},
            {
              $set: {
                paymentApproval: "waiting",
                approvalAmount: totalAmout,
              },
            },
            { new: true }
          );
          return res
            .status(200)
            .json({ message: "Request sent.Kindly wait for payment approval" });
        }
      }
    );
  } catch (error) {
    return res.status(500).json(error);
  }
};

//notifiy manager to pay all
// export const notifyManager = async (req, res) => {
//   // details of the staff making payment

//   try {
//     // details of the staff making payment
//     const token = req.header("Authorization").split(" ")[1];
//     const decoded = jwt.verify(token, process.env.LOGIN_SECRET);
//     const currentUser = await Farmers.findOne({ _id: decoded.id });
//     let staff_name = `${currentUser.firstname} ${currentUser.lastname}`;

//     Farmers.find(
//       { value: { $gt: 0 }, role: "farmer" },
//       async (err, farmers) => {
//         if (farmers?.length == 0) {
//           return res.status(404).json({
//             message: "Failed! There is no payable farmer at the moment",
//           });
//         } else {
//           // store total amount paid in array
//           const totalPaidArr = farmers.map((farmer) => {
//             return parseInt(farmer.value);
//           });
//           // add paid amounts in array
//           const totalAmout = totalPaidArr.reduce((a, b) => {
//             return a + b;
//           });

//           farmers?.map(async (farmer) => {
//             Farmers.updateMany(
//               { _id: farmer._id },
//               { $set: { paymentRequest: "waiting" } },
//               async (err, updatedRes) => {
//                 if (err) return res.status(403).json(err);
//               }
//             );
//             // store requests in the db
//             const storedRequest = await Requests.create({
//               sender_name: staff_name,
//               request_amount: farmer.value,
//               farmer_id: farmer._id,
//               status: "waiting approval",
//             });
//             // populate admin with request id,s
//             await Farmers.updateMany(
//               { role: "admin" },
//               { $push: { requestData: storedRequest._id } },
//               {
//                 new: true,
//               }
//             );
//           });
//           return res.status(200).json({
//             message: "Request sent.Kindly wait for payment approval",
//           });
//         }
//       }
//     );
//   } catch (error) {
//     return res.status(500).json(error);
//   }
// };
// notify manager to pay a single farmer
// export const notifySinglePayment = async (req, res) => {
//   const { farmerId } = req.params;
//   try {
//     const foundFarmer = await Farmers.findById({ _id: farmerId });
//     const total_amount = foundFarmer.value;
//     await Account.findOneAndUpdate(
//       {},
//       {
//         $set: {
//           paymentApproval: `Ksh ${total_amount} waiting aprroval`,
//           approvalAmount: total_amount,
//         },
//       },
//       { new: true }
//     );
//     return res
//       .status(200)
//       .json({ message: "Request sent.Kindly wait for payment approval" });
//   } catch (error) {
//     res.status(500).json(error);
//   }
// };

// notify manager to pay a single farmer
export const notifySinglePayment = async (req, res) => {
  const { farmerId } = req.params;
  try {
    // find respective farmer
    const foundFarmer = await Farmers.findOne({
      _id: farmerId,
    });
    const total_amount = foundFarmer.value;
    // details of the staff making payment
    const token = req.header("Authorization").split(" ")[1];
    const decoded = jwt.verify(token, process.env.LOGIN_SECRET);
    const currentUser = await Farmers.findOne({ _id: decoded.id });
    let staff_name = `${currentUser.firstname} ${currentUser.lastname}`;
    let farmer_id = foundFarmer._id;
    // if waiting approval dont store in the db
    if (foundFarmer.paymentRequest === "waiting")
      return res.status(422).json({ message: "Payment pending approval" });
    // store request in the db
    const storedRequest = await Requests.create({
      sender_name: staff_name,
      request_amount: total_amount,
      farmer_id,
      status: "waiting approval",
    });
    // populate admin with request id,s
    await Farmers.updateMany(
      { role: "admin" },
      { $push: { requestData: storedRequest._id } },
      {
        new: true,
      }
    ).populate("requestData");
    await Farmers.findByIdAndUpdate(
      { _id: farmerId },
      { $set: { paymentRequest: "waiting" } },
      { new: true }
    );
    return (
      res
        .status(200)
        // .json(foundRequest);
        .json({ message: "Request sent.Kindly wait for payment approval" })
    );
  } catch (error) {
    res.status(500).json(error);
  }
};

// approve multiple payments
export const approveMultiplePayment = async (req, res) => {
  try {
    const account = await Account.findOne();
    const requestedApprovalAmount = account.approvalAmount; //amount to approve
    const accountBalance = account.account_balance; //account balance

    if (requestedApprovalAmount > accountBalance) {
      return res.status(422).json({
        message: "Cannot process approval.Insufficent account balance",
      });
    }
    await Account.findOneAndUpdate(
      {},
      {
        $set: {
          paymentApproval: "approved",
          approvalAmount: 0,
        },
      },
      { new: true }
    );

    return res.status(200).json({ message: "You have approved payment" });
  } catch (error) {
    return res.status(500).json(error);
  }
};

// approve single payment
export const approvePayment = async (req, res) => {
  const { requestId } = req.params;
  try {
    const foundRequest = await Requests.findById({ _id: requestId });
    const account = await Account.findOne();
    const requestedApprovalAmount = foundRequest.request_amount; //amount to approve
    const accountBalance = account.account_balance; //account balance
    // check if request is approved
    if (foundRequest.status === "approved")
      return res
        .status(404)
        .json({ message: "The payment has already been approved" });
    // check if the acc balance is enough
    if (accountBalance < requestedApprovalAmount) {
      return res.status(422).json({
        message: "Cannot process approval.Insufficent account balance",
      });
    }
    await Requests.findByIdAndUpdate(
      { _id: requestId },
      { $set: { status: "approved" } },
      { new: true }
    );
    await Farmers.findByIdAndUpdate(
      { _id: foundRequest.farmer_id },
      { $set: { paymentRequest: "approved" } },
      { new: true }
    );

    return res
      .status(200)
      .json({ message: "You have succesfully approved payment" });
  } catch (error) {
    return res.status(500).json(error);
  }
};

// reject multiple payment
export const rejectMultiplePayments = async (req, res) => {
  try {
    await Account.findOneAndUpdate(
      {},
      {
        $set: {
          paymentApproval: "rejected",
        },
      },
      { new: true }
    );
    return res.status(404).json({ message: "Payment approval rejected" });
  } catch (error) {
    return res.ststus(500).json(error);
  }
};

// reject single payment
export const rejectSinglePayment = async (req, res) => {
  const { requestId } = req.params;
  try {
    const foundRequest = await Requests.findById({ _id: requestId });
    await Requests.findByIdAndUpdate(
      { _id: requestId },
      { $set: { status: "rejected" } },
      { new: true }
    );
    await Farmers.findByIdAndUpdate(
      { _id: foundRequest.farmer_id },
      { $set: { paymentRequest: "rejected" } },
      { new: true }
    );
    return res.status(404).json({ message: "Payment approval rejected" });
  } catch (error) {
    return res.status(500).json(error);
  }
};

// make single payment
export const makeSinglePayment = async (req, res) => {
  const account = await Account.findOne();
  const { farmer_id } = req.params;
  try {
    // find farmer by id provided
    const foundFarmer = await Farmers.findById({ _id: farmer_id }).populate(
      "coffeeDetails"
    );
    // check if the array has data
    const coffeeDetailsArr = foundFarmer?.coffeeDetails;
    // if (coffeeDetailsArr?.length == 0) {
    //   return res.status(422).json({ message: "Failed,No data found" });
    // } else {
    // store all the values under quantity key to an array
    const qty = await foundFarmer?.coffeeDetails?.map((coffeeDetail) => {
      return parseInt(coffeeDetail?.quantity);
    });
    // do the sumation of the kgs in the array
    const totalKilos = qty.reduce((a, b) => {
      return a + b;
    });
    // console.log("totalKilos are", totalKilos);
    // amount paid
    const amount_paid = totalKilos * process.env.RATE;
    // check if the account has funds
    if (account.account_balance == 0 || account.account_balance < amount_paid)
      return res.status(404).json({
        message: `Sorry! Insufficient funds.Your account balance is Ksh ${account.account_balance}`,
      });
    await Account.findOneAndUpdate(
      {},
      { $inc: { account_balance: -amount_paid } },
      { new: true }
    );
    // store payment details in the database
    const storedInfo = await Payment.create({
      name: foundFarmer?.firstname.concat(" ", foundFarmer?.lastname),
      farmerId: foundFarmer?.farmerId,
      quantity: totalKilos,
      amount: amount_paid,
      phone: foundFarmer?.phone_number,
    });

    // populate payment record in the farmers model with id,s
    const populatedRecord = await Farmers.findByIdAndUpdate(
      { _id: farmer_id },
      { $push: { paymentRecord: storedInfo._id } },
      { new: true }
    );
    // clear records after payment and debit the farmers's wallet
    await Farmers.findByIdAndUpdate(
      { _id: farmer_id },
      { $set: { paid: true, paymentRequest: "not sent" } },
      {
        $inc: { wallet: amount_paid },
      }
    );

    const clearedRecord = await Farmers.findByIdAndUpdate(
      { _id: farmer_id },

      {
        $unset: { coffeeDetails: [] },
        $set: { totalKilos: 0, value: 0 },
      },

      { new: true }
    );
    const fullname = populatedRecord?.firstname.concat(
      " ",
      foundFarmer?.lastname
    );
    return res.status(200).json({ message: `${fullname} succesfully paid` });
  } catch (error) {
    res.status(500).json(error);
  }
};

// pay all farmers(by manager)
export const payAllMng = async (req, res) => {
  const account = await Account.findOne();
  try {
    // find all farmers
    Farmers.find(
      { value: { $gt: 0 }, role: "farmer" },
      async (err, farmers) => {
        // if (err) return res.status(403).json(err);
        // get eligible farmers for payment
        if (farmers?.length == 0) {
          return res.status(404).json({
            message: "Failed! There is no payable farmer at the moment",
          });
        } else {
          // store total amount paid in array
          const totalPaidArr = farmers.map((farmer) => {
            return parseInt(farmer.value);
          });
          // add paid amounts in array
          const totalAmout = totalPaidArr.reduce((a, b) => {
            return a + b;
          });
          // console.log("Total Amount is", totalAmout);
          // check if ther'e funds
          if (
            account.account_balance == 0 ||
            account.account_balance < totalAmout
          ) {
            return res.status(404).json({
              message: `Sorry! Insufficient funds.Your account balance is Ksh ${account.account_balance}`,
            });
          } else {
            await Account.findOneAndUpdate(
              {},
              { $inc: { account_balance: -totalAmout } },
              { new: true }
            );
            // loop through all farmers and increase their wallets
            farmers.map(async (farmer) => {
              Farmers.updateMany(
                { _id: farmer._id },
                { $inc: { wallet: farmer.value }, $set: { paid: true } },
                async (err, updatedRes) => {
                  if (err) return res.status(403).json(err);
                }
              );
              // store payment details in the database

              const storedInfo = await Payment.create({
                name: farmer?.firstname.concat(" ", farmer?.lastname),
                farmerId: farmer?.farmerId,
                quantity: farmer?.totalKilos,
                amount: farmer?.value,
                phone: farmer?.phone_number,
              });

              // populate payment record in the farmers model with id,s
              await Farmers.updateMany(
                { _id: farmer._id },
                {
                  $push: { paymentRecord: storedInfo._id },
                  $unset: { coffeeDetails: [] },
                  $set: { totalKilos: 0, value: 0 },
                }
              );
            });
            return res
              .status(200)
              .json({ message: "Success,You have paid all farmers" });
          }
        }
      }
    );
  } catch (error) {
    res.status(500).json(error);
  }
};

// pay all farmers by staff
export const payAll = async (req, res) => {
  const account = await Account.findOne();
  let approvalMsg = account.paymentApproval;
  try {
    // find all farmers
    Farmers.find(
      { value: { $gt: 0 }, role: "farmer" },
      async (err, farmers) => {
        // if (err) return res.status(403).json(err);
        // get eligible farmers for payment
        if (farmers?.length == 0) {
          return res.status(404).json({
            message: "Failed! There is no payable farmer at the moment",
          });
        } else {
          // store total amount paid in array
          const totalPaidArr = farmers.map((farmer) => {
            return parseInt(farmer.value);
          });
          // add paid amounts in array
          const totalAmout = totalPaidArr.reduce((a, b) => {
            return a + b;
          });
          // console.log("Total Amount is", totalAmout);
          if (
            account.account_balance == 0 ||
            account.account_balance < totalAmout
          )
            return res.status(404).json({
              message: `Sorry! Insufficient funds.Your account balance is Ksh ${account.account_balance}`,
            });

          // console.log("approvalMsg", approvalMsg);
          // continue if approved
          // const aprroval = await Account.findOne();
          if (approvalMsg !== "approved")
            return res
              .status(422)
              .json({ message: "Payment pending approval" });

          await Account.findOneAndUpdate(
            {},
            { $inc: { account_balance: -totalAmout } },
            { new: true }
          );
          // loop through all farmers and increase their wallets
          farmers.map(async (farmer) => {
            Farmers.updateMany(
              { _id: farmer._id },
              { $inc: { wallet: farmer.value }, $set: { paid: true } },
              async (err, updatedRes) => {
                if (err) return res.status(403).json(err);
              }
            );
            // store payment details in the database

            const storedInfo = await Payment.create({
              name: farmer?.firstname.concat(" ", farmer?.lastname),
              farmerId: farmer?.farmerId,
              quantity: farmer?.totalKilos,
              amount: farmer?.value,
              phone: farmer?.phone_number,
            });

            // populate payment record in the farmers model with id,s
            await Farmers.updateMany(
              { _id: farmer._id },
              {
                $push: { paymentRecord: storedInfo._id },
                $unset: { coffeeDetails: [] },
                $set: { totalKilos: 0, value: 0, paymentRequest: "not sent" },
              }
            );
          });
          // reset the payment status
          await Account.findOneAndUpdate(
            {},
            { $set: { paymentApproval: "not sent" } },
            { new: true }
          );
          return res
            .status(200)
            .json({ message: "Success,You have paid all farmers" });
        }
      }
    );
  } catch (error) {
    res.status(500).json(error);
  }
};
// reset payment
export const resetPayment = async (req, res) => {
  try {
    const newFarmers = await Farmers.updateMany(
      { role: "farmer" },
      { $set: { paid: false } }
    );
    return res
      .status(200)
      .json({ message: "You have succesfuly reset payment" });
  } catch (error) {
    return res.status(500).json(error);
  }
};
// get all transactions made
export const getAllTrasanctions = async (req, res) => {
  try {
    const allTransactions = await Payment.find();
    if (allTransactions) return res.status(200).json(allTransactions);
  } catch (error) {
    res.status(500).json(error);
  }
};
// get single transaction
export const getSingleTransaction = async (req, res) => {
  const { farmerId } = req.params;
  try {
    // find the transaction using farmer's id
    const foundTransaction = await Payment.find({
      farmerId: farmerId,
    });
    return res.status(200).json(foundTransaction);
  } catch (error) {
    res.status(500).json(error);
  }
};
// withdrawal funds
export const withdrawal = async (req, res) => {
  const { farmerId } = req.params;
  try {
    const { withdrawalAmount } = req.body;
    // find customer by id
    if (!withdrawalAmount || withdrawalAmount == 0) {
      // server understood but the process did not respect the insctruction defined
      return res.status(422).json({ message: "Amount is required" });
    } else {
      const foundFarmer = await Farmers.findByIdAndUpdate(
        { _id: farmerId },
        {
          $inc: { wallet: -withdrawalAmount },
        },
        { new: true }
      );
      return res.status(200).json({
        message: `Success! you have withdrawn ${withdrawalAmount} from your wallet`,
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};
// get all waiting requests
export const getRequests = async (req, res) => {
  try {
    const requests = await Requests.find({ status: "waiting approval" });
    return res.status(200).json(requests);
  } catch (error) {
    return res.status(500).json(error);
  }
};
// get rejected requests
export const rejectedRequest = async (req, res) => {
  try {
    const rejectedRequests = await Requests.find({ status: "rejected" });
    return res.status(200).json(rejectedRequests);
  } catch (error) {
    return res.status(500).json(error);
  }
};
