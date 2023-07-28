const WebSocket = require("ws");
const {
  hasAvilablePeers,
  getAddressPeer,
  findMaxTable,
} = require("./services");

const senders = [];

let filteredAddresses;
let portsender;
let address;

let Delay = [];
let Size = [];

const wss = new WebSocket.Server({ port: 4000 });

wss.on("connection", async (ws, req) => {
  const senderIp = await getAddressPeer(req);
  console.log(`Connected to node: ${senderIp}`);

  ws.on("message", async (message) => {
    console.log(`Received data from node ${senderIp}: ${message}`);
    const { type, hash, delay, totaleSize } = JSON.parse(message);
    switch (type) {
      case "CONNECT_TO_NETWORK":
        const { id, port } = JSON.parse(message);
        portsender = port;
        address = `ws://${senderIp}:${port}`;

        const ipExists = senders.some((sender) => sender.peers === address);
        if (hasAvilablePeers(senders)) {
          if (ipExists === false) {
            if (senders.length > 3) {
              ws.send(JSON.stringify(senders.slice(-3)));
            } else {
              ws.send(JSON.stringify(senders));
            }
            senders.push({ id: id, peers: address });
          } else {
            filteredAddresses = senders.filter(
              (addressIp) => addressIp.peers !== address
            );
            if (filteredAddresses.length !== 0) {
              if (filteredAddresses.length >= 3) {
                ws.send(JSON.stringify(filteredAddresses.slice(-3)));
              } else {
                ws.send(JSON.stringify(filteredAddresses));
              }
            } else {
              ws.send(
                JSON.stringify(
                  "There is  no peer available for now, Try later "
                )
              );
            }
          }
        } else {
          senders.push({ id: id, peers: address });
          ws.send(
            JSON.stringify("There is  no peer available for now, Try later ")
          );
        }
        console.table(senders);
        filteredAddresses = [];
        break;
      case "GET_PEERS_NUMBER":
        const nbrPeers = senders.length.toString();
        console.log(nbrPeers);
        ws.send(JSON.stringify(nbrPeers));
        break;
      case "NEW_DELAY":
        if (Delay.length === 0) {
          Delay.push({ hash: "", delay: 0 });
          Delay.push({ hash, delay });
        } else {
          const index = Delay.findIndex((item) => item.hash === hash);
          if (index !== -1) {
            if (Delay[index].delay < delay) {
              Delay[index].delay = delay;
            }
          } else {
            Delay.push({ hash, delay });
          }
        }
        break;
      case "MAX_DELAY":
        const maxDelay = [0];
        Delay.forEach((item) => {
          maxDelay.push(item.delay);
        });
        ws.send(JSON.stringify(maxDelay));
        break;
      case "NEW_SIZE":
        Size.push({ hash, totaleSize });
        break;
      case "MAX_SIZE":
        const customSize = [0];
        Size.forEach((item) => {
          customSize.push(item.totaleSize);
        });
        ws.send(JSON.stringify(customSize));
        break;
      default:
        console.log(`Unknown message type: ${type}`);
        break;
    }
  });

  ws.on("error", (err) => {
    console.error(`Error connecting to node: ${senderIp}: ${err}`);
  });

  // Handle disconnects
  ws.on("close", () => {
    // const index = senders.findIndex((item) => item.peers.includes(address));
    // if (index != -1) {
    //   senders.splice(index, 1);
    //   console.log(`Disconnected from node : ${senderIp}:${portsender}`);
    // }
  });
});

wss.on("listening", () => {
  const address = wss.address();
  console.log(`Server listening on ${address.address}:${address.port}`);
});