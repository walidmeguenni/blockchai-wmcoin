const start = require("../start");
const { Node } = require("./Peer");
const { Wmcoin } = require("./main");
const fs = require("fs");

class Graph {
  constructor() {
    this.dataFile = "./core/data.json";
    this.nbrBlock = 0;
    this.nbrTxns = 0;
    this.nbrMsg = 0;
    this.nbrTotalePeers = 0;
    this.nbrBroacastMsg = 0;
    this.nbrGossipMsg = 0;
    this.nbrOlsrMsg = 0;
    this.lastNbrPeers = 0;
    this.labelPeers = [];
    this.labelSize = ["0"];

    this.lastMsg = 0;
    this.datasetsSize = [
      {
        label: "olsr",
        data: [0],
        backgroundColor: "rgba(0, 123, 255, 0.5)",
        borderColor: "rgba(0, 123, 255, 1)",
        borderWidth: 2,
      },
      {
        label: "broadcast",
        data: [0],
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
      },
      {
        label: "gossip",
        data: [0],
        backgroundColor: "rgba(0, 255, 0, 0.5)",
        borderColor: "rgba(0, 255, 0, 1)",
        borderWidth: 2,
      },
    ];
    this.datasetsPeers = [
      {
        label: "olsr",
        data: [],
        backgroundColor: "rgba(0, 123, 255, 0.5)",
        borderColor: "rgba(0, 123, 255, 1)",
        borderWidth: 2,
      },
      {
        label: "gossip",
        data: [],
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
      },
      {
        label: "braodcast",
        data: [],
        backgroundColor: "rgba(0, 255, 0, 0.5)",
        borderColor: "rgba(0, 255, 0, 1)",
        borderWidth: 2,
      },
    ];
    this.datasetsProtocol = [
      {
        label: "olsr",
        data: [0],
        backgroundColor: "rgba(0, 123, 255, 0.5)",
        borderColor: "rgba(0, 123, 255, 1)",
        borderWidth: 2,
      },
      {
        label: "gossip",
        data: [0],
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
      },
      {
        label: "braodcast",
        data: [0],
        backgroundColor: "rgba(0, 255, 0, 0.5)",
        borderColor: "rgba(0, 255, 0, 1)",
        borderWidth: 2,
      },
    ];
    this.labelesProtocol = ["0"];

    this.datasetsdelay = [
      {
        label: "olsr",
        data: [],
        backgroundColor: "rgba(0, 123, 255, 0.5)",
        borderColor: "rgba(0, 123, 255, 1)",
        borderWidth: 2,
      },
      {
        label: "gossip",
        data: [],
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
      },
      {
        label: "braodcast",
        data: [],
        backgroundColor: "rgba(0, 255, 0, 0.5)",
        borderColor: "rgba(0, 255, 0, 1)",
        borderWidth: 2,
      },
    ];
    this.lengthdelay = 0;
  }
  async getControlMessage() {
    this.nbrBlock = Wmcoin.chain.length;
    this.nbrTxns = Wmcoin.transactions.length;
    if (this.nbrBlock <= 1) {
      this.nbrMsg = this.nbrTxns;
    } else {
      this.nbrMsg = this.nbrTxns + this.nbrBlock * 11 - 9;
    }
    this.nbrTotalePeers = parseInt(await Node.getPeersNumbers());
    console.log("number :", this.nbrTotalePeers);

    this.nbrBroacastMsg = this.nbrBroacastMsg + this.numberBroadcastMsg();
    this.nbrGossipMsg = this.nbrGossipMsg + this.numberGossipMsg();
    this.nbrOlsrMsg = this.nbrOlsrMsg + (this.nbrTotalePeers - 1);
    console.log(this.nbrBroacastMsg, this.nbrGossipMsg, this.nbrOlsrMsg);
    this.labelesProtocol.push(this.nbrMsg.toString());
    this.datasetsProtocol[0].data.push(this.nbrOlsrMsg);
    this.datasetsProtocol[1].data.push(this.nbrGossipMsg);
    this.datasetsProtocol[2].data.push(this.nbrBroacastMsg);
    if (this.nbrTotalePeers > this.lastNbrPeers) {
      this.labelPeers.push(this.nbrTotalePeers.toString());
      this.datasetsPeers[0].data.push(this.nbrOlsrMsg);
      this.datasetsPeers[1].data.push(this.nbrGossipMsg);
      this.datasetsPeers[2].data.push(this.nbrBroacastMsg);
    } else {
      const index = this.labelPeers.findIndex(
        (item) => item === this.nbrTotalePeers.toString()
      );
      if (index !== -1) {
        this.datasetsPeers[0].data[index] = this.nbrOlsrMsg;
        this.datasetsPeers[1].data[index] = this.nbrGossipMsg;
        this.datasetsPeers[2].data[index] = this.nbrBroacastMsg;
      }
    }
    this.lastNbrPeers = this.nbrTotalePeers;
  }

  addSize(size) {
    this.labelSize.push(this.labelSize.length.toString());
    this.datasetsSize[0].data.push((this.nbrTotalePeers - 1) * size);
    this.datasetsSize[1].data.push(this.numberBroadcastMsg() * size);
    this.datasetsSize[2].data.push(this.numberGossipMsg() * size);
  }
  async getMaxDelay() {
    try {
      let db = this.readDataFromFile();

      const customdelay = await Node.getMaxDelay();
      const distance = customdelay.length - this.lengthdelay;
      const meduim = customdelay.slice(-distance);
      let res = 0;
      meduim.forEach((item) => (res += item));
      if (distance !== 0) {
        let m = (res /= distance);
        res = Math.ceil(m);

        if (start.protocol === "olsr") {
          if (start.analysis === "nodes") {
            if (customdelay.length > this.lengthdelay) {
              db.olsr.nodes.push(res);
            }
          } else {
            db.olsr.transaction = customdelay;
          }
        }
        if (start.protocol === "broadcast") {
          if (start.analysis === "nodes") {
            if (customdelay.length > this.lengthdelay) {
              db.broadcast.nodes.push(res);
            }
          } else {
            db.broadcast.transaction = customdelay;
          }
        }
        if (start.protocol === "gossip") {
          if (start.analysis === "nodes") {
            if (customdelay.length > this.lengthdelay) {
              db.gossip.nodes.push(res);
            }
          } else {
            db.gossip.transaction = customdelay;
          }
        }
      }
      this.lengthdelay = customdelay.length;
      this.writeDataToFile(db);
      db = this.readDataFromFile();
      if (start.analysis === "nodes") {
        this.datasetsdelay[0].data = db.olsr.nodes;
        this.datasetsdelay[1].data = db.gossip.nodes;
        this.datasetsdelay[2].data = db.broadcast.nodes;
      } else {
        this.datasetsdelay[0].data = db.olsr.transaction;
        this.datasetsdelay[1].data = db.gossip.transaction;
        this.datasetsdelay[2].data = db.broadcast.transaction;
      }
    } catch (error) {
      console.error("Error in getMaxDelay:", error);
      throw error; // Propagate the error to the caller
    }
  }

  readDataFromFile() {
    try {
      if (!fs.existsSync(this.dataFile)) {
        // Create an empty file if it doesn't exist
        fs.writeFileSync(
          this.dataFile,
          `{
          "broadcast": {
            "nodes": [],
            "transaction": []
          },
          "olsr": {
            "nodes": [],
            "transaction": []
          },
          "gossip": {
            "nodes": [],
            "transaction": []
          }
        }`,
          "utf8"
        );
      }
      const data = fs.readFileSync(this.dataFile, "utf8");
      return JSON.parse(data);
    } catch (err) {
      console.error("Error reading data from file:", err);
      return [];
    }
  }
  writeDataToFile(data) {
    try {
      const jsonData = JSON.stringify(data);
      fs.writeFileSync(this.dataFile, jsonData, "utf8");
      console.log("Data written to file successfully");
    } catch (err) {
      console.error("Error writing data to file:", err);
    }
  }
  numberGossipMsg() {
    switch (this.nbrTotalePeers) {
      case 2:
        return 1;
        break;
      case 3:
        return 4;
      default:
        return this.nbrTotalePeers * 2;
        break;
    }
  }
  numberBroadcastMsg() {
    switch (this.nbrTotalePeers) {
      case 2:
        return 1;
        break;
      case 3:
        return 4;
      case 4:
        return 9;
      case 5:
        return 14;
      default:
        return 5 * (this.nbrTotalePeers - 6) + 19;
        break;
    }
  }
}
const graph = new Graph();

module.exports = graph;
