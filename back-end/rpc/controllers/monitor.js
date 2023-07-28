const graph = require("../../core/Graph");
const start = require("../../start");

exports.getStatistic = async (req, res) => {
  try {
    await graph.getMaxDelay();
    res.status(201).json({
      protocol: start.protocol,
      lablesProtocols:
        start.analysis === "transaction" ? graph.labelSize : undefined,
      datasetsProtocols: graph.datasetsProtocol,
      datasetDelay: graph.datasetsdelay,
      labelePeers: start.analysis === "nodes" ? graph.labelPeers : undefined,
      datasetsPeers:
        start.analysis === "nodes" ? graph.datasetsPeers : undefined,
      lableDelay:
        start.analysis === "nodes" ? graph.labelPeers : graph.labelSize,
      labeleSize: graph.labelSize,
      datasetsSize: graph.datasetsSize,
      NumberMsg: graph.nbrMsg,
      analysis: start.analysis,
    });
  } catch (error) {
    console.log(error);
  }
};
