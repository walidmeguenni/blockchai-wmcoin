const { broadcast, sendMessage } = require("../../services");
const { Wmcoin } = require("../../core/main");
const { Node } = require("../../core/Peer");
const Message = require("../../core/Message");
const graph = require("../../core/Graph");
const start = require("../../start");
const sizeof = require("object-sizeof");

let mining = false;
let miningInterval;

exports.startMiningHandler = (walletAddress, privateKey) => {
  try {
    if (!mining) {
      console.log("Mining started");
      mining = true;
      miningInterval = setInterval(async () => {
        if (Wmcoin.mineBlock(walletAddress, privateKey)) {
          const oldtime = new Date(parseInt(Wmcoin.getLastBlock().timestamp));
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
          const size = sizeof([Wmcoin.getLastBlock(), Wmcoin.difficulty, time]);
          if (start.protocol === "gossip") {
            sendMessage([
              Message.createMessage(
                Node.id,
                "NEW_BLOCK",
                [Wmcoin.getLastBlock(), Wmcoin.difficulty, time],
                Node.address,
                undefined
              ),
              Node.openedPeers,
            ]);
          } else {
            broadcast(
              Message.createMessage(
                Node.id,
                "NEW_BLOCK",
                [Wmcoin.getLastBlock(), Wmcoin.difficulty, time],
                Node.address,
                undefined
              ),
              Node.openedPeers
            );
          }
          graph.addSize(size);
          await Node.setMaxDelay(Wmcoin.getLastBlock().hash, time);

          console.log("#-----------Block mined successfully");
          return true;
        } else {
          return false;
        }
      }, 1000);
    }
  } catch (error) {
    console.log(error);
  }
};

// ------------------------Handler function for "stopMining" event-------------//
exports.stopMiningHandler = () => {
  if (mining) {
    console.log("Mining stopped");
    mining = false;
    clearInterval(miningInterval);
    mining = false;
    return true;
  } else {
    console.log("mining aleardy stoped");
    return false;
  }
};

exports.getConfirmedTransactions = (publicKey) => {
  const confirmedTransactions = [];

  for (const block of Wmcoin.chain) {
    for (const transaction of block.transactions) {
      if (transaction.from === publicKey) {
        confirmedTransactions.push(transaction);
      }
    }
  }

  return confirmedTransactions;
};

exports.getUnconfirmedTransactions = (publicKey) => {
  const unconfirmedTransactions = [];

  for (const transaction of Wmcoin.transactions) {
    if (transaction.from === publicKey) {
      unconfirmedTransactions.push(transaction);
    }
  }

  return unconfirmedTransactions;
};

exports.getminedBlocks = (publicKey) => {
  const minedBlocks = [];

  for (const block of Wmcoin.chain) {
    for (const transaction of block.transactions) {
      if (
        transaction.to === publicKey &&
        transaction.from === "00000000000000000000"
      ) {
        minedBlocks.push(block);
      }
    }
  }

  return minedBlocks;
};

exports.getRecievedTransactions = (publicKey) => {
  const recievedTransactions = [];

  for (const block of Wmcoin.chain) {
    for (const transaction of block.transactions) {
      if (transaction.to === publicKey) {
        recievedTransactions.push(transaction);
      }
    }
  }

  return recievedTransactions;
};
