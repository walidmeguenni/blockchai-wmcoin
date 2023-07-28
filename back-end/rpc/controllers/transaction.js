const EC = require("elliptic").ec;
const ec = new EC("secp256k1");
const Transaction = require("../../core/Transaction");
const { Wmcoin } = require("../../core/main");
const { SHA256 } = require("../../utils/sha256");
const { Node } = require("../../core/Peer");
const { broadcast, sendMessage } = require("../../services");
const Message = require("../../core/Message");
const graph = require("../../core/Graph");
const sizeof = require("object-sizeof");
const start = require("../../start");
exports.sendTransaction = async (req, res) => {
  try {
    const { from, to, amount, gas, privateKey } = req.body;
    const keyPair = ec.keyFromPrivate(privateKey);
    if (keyPair.getPublic("hex") === from) {
      const signature = keyPair
        .sign(
          SHA256(from + to + amount + gas + Date.now().toString()),
          "base64"
        )
        .toDER("hex");
      const transaction = new Transaction(from, to, amount, gas, signature);
      const status = Wmcoin.addTransaction(transaction);
      if (status) {
        const oldtime = new Date(parseInt(transaction.timestamp));
        const minutes = oldtime.getMinutes();
        const seconds = oldtime.getSeconds();
        const milliseconds = oldtime.getMilliseconds();
        const delayedTime = new Date();
        const delayedMinutes = delayedTime.getMinutes();
        const delayedSeconds = delayedTime.getSeconds();
        const delaymilliseconds = delayedTime.getMilliseconds();
        const time = Math.ceil(
          delayedMinutes * 60 +
          delayedSeconds +
          delaymilliseconds * 0.001 -
          (minutes * 60 + seconds + milliseconds * 0.001)
          );
        await graph.getControlMessage();
        const size = sizeof([transaction, time]);
        if (start.protocol === "gossip") {
          sendMessage([
            Message.createMessage(
              Node.id,
              "CREATE_NEW_TRANSACTION",
              [transaction, time],
              Node.address,
              undefined
            ),
            Node.openedPeers,
          ]);
        } else {
          broadcast(
            Message.createMessage(
              Node.id,
              "CREATE_NEW_TRANSACTION",
              [transaction, time],
              Node.address,
              undefined
            ),
            Node.openedPeers
          );
        }
        graph.addSize(size);
        await Node.setMaxDelay(transaction.signature, time);
        res.status(202).json({
          _message: "transaction send",
          transaction: transaction,
          status: true,
        });
      } else {
        res.status(400).send("transaction not valid");
      }
    } else {
      res.status(400).send("keys not match ");
    }
  } catch (error) {
    console.log(error);
  }
};

exports.getTransactions = (req, res) => {
  const transactions = Wmcoin.transactions;
  res.status(201).json({ Transactions: transactions });
};
