const WebSocket = require("ws");
const EC = require("elliptic").ec;

const neighbors = require("../core/Neighbors");
const { Node } = require("../core/Peer");
const Message = require("../core/Message");
const start = require("../start");

const ec = new EC("secp256k1");

exports.connect = async (address, status = false, id) => {
  if (
    Node.connectedPeers.includes((item) => item.address === address) ||
    address === Node.address
  ) {
    return;
  }

  try {
    const socket = new WebSocket(address);
    await new Promise((resolve, reject) => {
      socket.addEventListener("open", resolve);
      socket.addEventListener("error", reject);
      socket.addEventListener("close", reject);
    });

    Node.openedPeers.push({ id, address, socket });
    Node.connectedPeers.push({ id, address });
    console.log(Node.address);
    socket.send(
      Message.createMessage(
        Node.id,
        "TYPE_HANDSHAKE",
        Node.connectedPeers,
        Node.address,
        status
      )
    );

    console.log("#");
    console.log("#");
    console.log("#");
    console.log("#");
    console.log(`#----------New peer add to the List of Peers:${address}`);

    socket.addEventListener("close", () => {
      Node.openedPeers.splice(
        Node.openedPeers.indexOf((item) => item.address === address),
        1
      );
      Node.connectedPeers.splice(
        Node.connectedPeers.indexOf((item) => item.address === address),
        1
      );
    });
  } catch (error) {
    console.log("#");
    console.log("#");
    console.log("#");
    console.log("#");
    console.error(
      `#----------Failed to connect to peer at ${address}: ${error}----------#`
    );
  }
};

exports.sendMessage = (message) => {
  switch (start.protocol) {
    case "broadcast":
      this.broadcast(message, Node.openedPeers);
      break;
    case "gossip":
      gossipProtocol(message);
      break;
    case "olsr":
      olsrProtocol(message);
      break;
    default:
      console.log("Invalid method of sending message");
      break;
  }
};

exports.broadcast = (message, peers) => {
  peers.forEach((node) => {
    node.socket.send(message);
  });
};

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function getRandomSubset(nodes) {
  const shuffled = shuffleArray(nodes);
  const nbrPeers =
    nodes.length <= 3 ? 1 : Math.ceil((nodes.length * 30) / 100) - 1;
  const selectedPeers = shuffled.slice(0, nbrPeers);
  selectedPeers.map((item) => Node.gossipPeers.push(item));
}

const gossipProtocol = (data) => {
  const [message, nodes] = data;
  const numRounds = Math.ceil((Node.openedPeers.length * 60) / 100);
  if (nodes.length > 2) {
    for (let index = 0; index < numRounds; index++) {
      if (Node.gossipPeers.length === 0) {
        getRandomSubset(nodes);
      } else {
        const node = Node.gossipPeers[0];
        const newNodes = nodes.filter((item) => item.id !== node.id);
        getRandomSubset(newNodes);
      }
    }
  } else {
    Node.gossipPeers = nodes;
  }
  this.broadcast(message, Node.gossipPeers);
  Node.gossipPeers = [];
};

const olsrProtocol = async (data) => {
  const [message, id, address] = data;
  getOlsrPeers(id, address);
  await this.broadcast(message, Node.olsrPeers);
  Node.olsrPeers = [];
};

const getOlsrPeers = (id, address) => {
  const selectedPeers = [];
  Node.openedPeers.filter((peer) => {
    if (peer.address !== address) {
      const foundNeighbor = neighbors
        .get()
        .find((neighbor) => neighbor.id === peer.id);
      if (foundNeighbor && !foundNeighbor.neighbors.includes(address)) {
        selectedPeers.push(peer);
      }
    }
  });

  const ListSender =
    neighbors.get().find((item) => item.id === id)?.neighbors || [];
  if (ListSender.length === 1) {
    Node.olsrPeers = selectedPeers;
  } else {
    selectedPeers.forEach((node) => {
      const rankPeers = [];
      const ListselectetdPeers =
        neighbors.get().find((item) => item.id === node.id)?.neighbors || [];
      ListSender.forEach((item) => {
        const index = ListselectetdPeers.findIndex((value) => value === item);
        if (index !== -1) {
          rankPeers.push({ address: item, rank: index });
        }
      });

      const minRank = rankPeers.reduce((min, peer) => {
        return peer.rank < min.rank ? peer : min;
      });
      console.log(minRank);
      if (minRank && minRank.address === Node.address) {
        Node.olsrPeers.push(node);
      }
    });
  }
};

exports.signTranasction = (from, privateKey) => {
  const keyPair = ec.keyFromPrivate(privateKey);
  if (keyPair.getPublic("hex") === from) {
    return keyPair
      .sign(SHA256(from + "" + amount + gas), "base64")
      .toDER("hex");
  }
  return false;
};

exports.shape = `
#          W       W       w  M         M   C C C C C
#           W     W W     w   M M     M M  C 
#            W   W   W   w    M  M   M  M  C
#             W W     W w     M   M M   M  C
#              W       W      M    M    M   C C C C C
#`;
