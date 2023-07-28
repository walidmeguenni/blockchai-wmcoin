const WebSocket = require("ws");
const Block = require("../core/Block");
const neighbors = require("../core/Neighbors");
const { Blockchain, Wmcoin } = require("../core/main");
const { sendMessage, connect, broadcast } = require("../services");
const { Node } = require("../core/Peer");
const Message = require("../core/Message");
const graph = require("../core/Graph");
const start = require("../start");
const sizeof = require("object-sizeof");
exports.startWebSocketServer = (server) => {
  const ws = new WebSocket.Server({ server });

  ws.on("connection", (socket, req) => {
    socket.on("message", async (message) => {
      const { id, type, data, address, status } = JSON.parse(message);
      Message.recieveMessageOnTerminal(address, type);
      switch (type) {
        case "TYPE_HANDSHAKE":
          if (!status) {
            connect(address, true, id);
          } else {
            const node = Node.openedPeers.filter(
              (item) => item.address === address
            );
            node[0].socket.send(
              Message.createMessage(
                undefined,
                "GET_CHAIN",
                undefined,
                Node.address,
                undefined
              )
            );
          }
          if (start.protocol === "olsr") {
            data.map((node) => {
              neighbors.HelperTable.push(node.address);
            });
            neighbors.push(id, neighbors.HelperTable);
            neighbors.HelperTable = [];
          }

          break;
        case "GET_CHAIN":
          const node = Node.openedPeers.filter(
            (item) => item.address === address
          );
          node[0].socket.send(
            Message.createMessage(
              undefined,
              "REPALCE_TYPE_CHAIN",
              [Wmcoin.chain, Wmcoin.transactions],
              Node.address,
              undefined
            )
          );
          break;
        case "REPALCE_TYPE_CHAIN":
          const [newChain, Tnxs] = data;
          if (
            Blockchain.isValidChain(newChain) &&
            newChain.length >= Wmcoin.chain.length
          ) {
            Wmcoin.chain = newChain;
            if (
              Tnxs.length >= Wmcoin.transactions.length &&
              Wmcoin.isValidMemPool(Tnxs)
            ) {
              Wmcoin.transactions = Tnxs;
              const node = Node.openedPeers.filter(
                (item) => item.address === address
              );
              node[0].socket.send(
                Message.createMessage(
                  Node.id,
                  "CHAIN",
                  data,
                  Node.address,
                  undefined
                )
              );
            }
          }
          if (start.protocol === "olsr") {
            const updatedPeers = Node.openedPeers.filter(
              (item) => item.address !== address
            );
            broadcast(
              Message.createMessage(
                Node.id,
                "UPDATE_NEITGBORS",
                Node.connectedPeers,
                Node.address,
                undefined
              ),
              updatedPeers
            );
          }
          break;
        case "CHAIN":
          const [receivedChain, tnxs] = data;
          if (start.protocol === "olsr") {
            const updatedPeers = Node.openedPeers.filter(
              (item) => item.address !== address
            );
            broadcast(
              Message.createMessage(
                Node.id,
                "UPDATE_NEITGBORS",
                Node.connectedPeers,
                Node.address,
                undefined
              ),
              updatedPeers
            );
          }
          if (
            Blockchain.isValidChain(receivedChain) &&
            receivedChain.length > Wmcoin.chain.length
          ) {
            Wmcoin.chain = newChain;
            if (
              tnxs.length >= Wmcoin.transactions.length &&
              Wmcoin.isValidMemPool(Tnxs)
            ) {
              Wmcoin.transactions = Tnxs;
              console.log(
                "Received blockchain is valid. Replacing current blockchain with received blockchain."
              );
            }
          }
          break;
        case "UPDATE_NEITGBORS":
          data.map((node) => {
            neighbors.HelperTable.push(node.address);
          });
          neighbors.push(id, neighbors.HelperTable);
          neighbors.HelperTable = [];
          break;
        case "CREATE_NEW_TRANSACTION":
          const size = sizeof(data);
          const [transaction, time] = data;
          if (Wmcoin.addTransaction(transaction)) {
            const date = new Date();
            const delayedMinutes = date.getMinutes();
            const delayedSeconds = date.getSeconds();
            const delaymilliseconds = date.getMilliseconds();
            const delayTime = Math.ceil(
              delayedMinutes * 60 +
              delayedSeconds +
              delaymilliseconds * 0.001 -
              time
              );
            await graph.getControlMessage();
            graph.addSize(size);
            await Node.setMaxDelay(transaction.signature, delayTime);
            if (start.protocol === "broadcast" || start.protocol === "gossip") {
              const updatedPeers = Node.openedPeers.filter(
                (item) => item.address !== address
              );
              if (start.protocol === "gossip") {
                sendMessage([
                  Message.createMessage(
                    Node.id,
                    "CREATE_NEW_TRANSACTION",
                    data,
                    Node.address,
                    undefined
                  ),
                  updatedPeers,
                ]);
              } else {
                broadcast(
                  Message.createMessage(
                    Node.id,
                    "CREATE_NEW_TRANSACTION",
                    data,
                    Node.address,
                    undefined
                  ),
                  updatedPeers
                );
              }
            } else {
              sendMessage([
                Message.createMessage(
                  Node.id,
                  "CREATE_NEW_TRANSACTION",
                  data,
                  Node.address,
                  undefined
                ),
                id,
                address,
              ]);
            }
          }
          //sending new data to the seed node
          break;
        case "NEW_BLOCK":
          console.log(`Received and added a new block from peer ${address}`);
          const [newBlock, newDiff, oldtime] = data;
          const sizeBlock = sizeof(data);
          if (
            !Block.isValidNewBlock(
              newBlock,
              Wmcoin.getLastBlock(),
              Wmcoin.difficulty
            )
          ) {
            console.log("Received an invalid new block from peer");
            return;
          }
          const txnsToRemove = new Set(
            newBlock.transactions.map((item) => item.signature)
          );
          Wmcoin.transactions = Wmcoin.transactions.filter(
            (item) => !txnsToRemove.has(item.signature)
          );
          //Wmcoin.difficulty = newDiff;
          Wmcoin.chain.push(newBlock);
          const date = new Date();
          const delayedMinutes = date.getMinutes();
          const delayedSeconds = date.getSeconds();
          const delaymilliseconds = date.getMilliseconds();
          const delayTime = Math.ceil(
            delayedMinutes * 60 +
            delayedSeconds +
            delaymilliseconds * 0.001 -
            oldtime
            );
            
          await graph.getControlMessage();
          await Node.setMaxDelay(newBlock.hash, delayTime);
          graph.addSize(sizeBlock);
          if (start.protocol === "broadcast" || start.protocol === "gossip") {
            const updatedPeers = Node.openedPeers.filter(
              (item) => item.address !== address
            );
            if (start.protocol === "gossip") {
              sendMessage([
                Message.createMessage(
                  Node.id,
                  "NEW_BLOCK",
                  data,
                  Node.address,
                  undefined
                ),
                updatedPeers,
              ]);
            } else {
              broadcast(
                Message.createMessage(
                  Node.id,
                  "NEW_BLOCK",
                  data,
                  Node.address,
                  undefined
                ),
                updatedPeers
              );
            }
          } else {
            sendMessage([
              Message.createMessage(
                Node.id,
                "NEW_BLOCK",
                data,
                Node.address,
                undefined
              ),
              id,
              address,
            ]);
          }

          //sending new data to the seed node

          break;
        default:
          console.log(`Unknown message type: ${type}`);
      }
    });

    socket.on("error", (err) => {
      console.error(`WebSocket error: ${err}`);
    });

    socket.on("close", () => {
      console.log(`Disconnected from node : ${socket.url}`);
    });
  });
};
