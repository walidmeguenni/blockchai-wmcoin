const { Wmcoin } = require("../../core/main");
const { wallet } = require("../../core/wallet");
const {
  getConfirmedTransactions,
  getUnconfirmedTransactions,
  getminedBlocks,
  getRecievedTransactions,
} = require("../services");

exports.create = (req, res) => {
  const account = wallet.create(req.body.password);
  res.status(202).json({ wallet: account });
};

exports.Verify = (req, res) => {
  try {
    const { publicKey, privateKey } = req.body;
    const status = wallet.isValidaccount(publicKey, privateKey);
    console.log(status);
    if (status) {
      res.status(202).json({ status });
    } else {
      res.status(202).json({ message: "Keys doesn't match " });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.Info = (req, res) => {
  try {
    const { publicKey } = req.body;
    const balance = Wmcoin.getBalance(publicKey);
    const confirmedTransactions = getConfirmedTransactions(publicKey);
    const unconfirmedTransactions = getUnconfirmedTransactions(publicKey);
    const minedBlocks = getminedBlocks(publicKey);
    const recievedTranasaction = getRecievedTransactions(publicKey);
    res.status(202).json({
      balance,
      confirmedTransactions,
      unconfirmedTransactions,
      minedBlocks,
      recievedTranasaction,
    });
  } catch (error) {
    console.log(error);
  }
};
