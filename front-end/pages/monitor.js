import React, { useState, useEffect } from "react";

import axios from "axios";
import { LineChart } from "@/components";

const Monitor = () => {
  const [lablesProtocols, setLablesProtocols] = useState(undefined);
  const [datasetsProtocols, setDatasetsProtocols] = useState(undefined);
  const [labledelay, setLabledelay] = useState(undefined);
  const [datasetsDelay, setDatasetsDelay] = useState(undefined);
  const [lablePeers, setLablePeers] = useState(undefined);
  const [datasetsPeers, setDatasetsPeers] = useState(undefined);
  const [datasetsSize, setDatasetsSize] = useState(undefined);
  const [lableSize, setLableSize] = useState(undefined);
  const [protocol, setProtocol] = useState("");
  const [bestProtocol, setBestProtocol] = useState("");
  const [nbrMsg, setNbrMsg] = useState(0);
  const [analysis, setAnalysis] = useState("nodes");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/monitor");
        console.log("labeldelay", response.data.lableDelay);
        console.log("datasetselay", response.data.datasetDelay);
        console.log("labelPeer", response.data.labelePeers);
        console.log("datasetPeer", response.data.datasetsPeers);
        setLablesProtocols(response.data.lablesProtocols);
        setDatasetsProtocols(response.data.datasetsProtocols);
        setLabledelay(response.data.lableDelay);
        setDatasetsDelay(response.data.datasetDelay);
        setLablePeers(response.data.labelePeers);
        setDatasetsPeers(response.data.datasetsPeers);
        setLableSize(response.data.labeleSize);
        setDatasetsSize(response.data.datasetsSize);
        setNbrMsg(response.data.NumberMsg);
        setProtocol(response.data.protocol);
        setAnalysis(response.data.analysis);
      } catch (error) {
        console.error("Error fetching performance data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const calculateProtocolPerformance = () => {
      const lengthTable = [];
      if (datasetsProtocols) {
        datasetsProtocols.map((item) => {
          lengthTable.push({
            protocol: item.label,
            val: item.data[item.data.length - 1],
          });
        });
        const best = lengthTable.reduce((min, length) => {
          return min.val > length.val ? length : min;
        });

        setBestProtocol(best);
      }
    };

    calculateProtocolPerformance();
  }, [datasetsProtocols]);

  return (
    <div className="bg-gray-100 py-6">
      <div className="container mx-auto px-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Performance Monitor
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {lablesProtocols && datasetsProtocols && (
            <div className="bg-white rounded-lg shadow-md p-4 relative">
              <h2 className="text-sm font-bold pt-1">
                Number of Broadcasting by each Protocols
              </h2>

              <LineChart
                labels={lablesProtocols}
                datasets={datasetsProtocols}
                xAxis="Nbr  Transactions & Blocks"
                yAxis="Nbr  Broadcasting (T&B)"
                chartType="line"
              />
            </div>
          )}
          {labledelay && datasetsDelay && (
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-sm font-bold pt-1">
                Delay using Protocol {protocol}
              </h2>

              <LineChart
                labels={labledelay}
                datasets={datasetsDelay}
                xAxis={
                  analysis === "nodes"
                    ? "Nbr Peers"
                    : "Nbr Transactions & Blocks"
                }
                yAxis="delay (ms)"
                chartType={analysis === "nodes" ? "bar" : "line"}
              />
            </div>
          )}
          {lablePeers && datasetsPeers && (
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-sm font-bold pt-1">
                Scalability for each protocol according to {nbrMsg} T&B
              </h2>

              <LineChart
                labels={lablePeers}
                datasets={datasetsPeers}
                xAxis="Nbr Peers"
                yAxis="Nbr  Broadcasting (T&B)"
                chartType="bar"
              />
            </div>
          )}
          {lableSize && datasetsSize && (
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-sm font-bold pt-1">
                Size of Broadcasting for each(T&B) and each Protocol
              </h2>

              <LineChart
                labels={lableSize}
                datasets={datasetsSize}
                xAxis="Nbr Transactions & Blocks"
                yAxis="Size (Byte) of Broadcasting for each (T&B)"
                chartType="line"
              />
            </div>
          )}
          {bestProtocol && bestProtocol.val !== 0 && nbrMsg !== 0 && (
            <div className="bg-white rounded-lg shadow-md p-6 flex  justify-center">
              <div>
                <h2 className="text-2xl font-bold text-blue-600 mb-4">
                  Performance Statistics
                </h2>

                <p className="text-lg text-gray-800">
                  The best performing protocol is{" "}
                  <strong className="text-blue-800">
                    {bestProtocol.protocol}
                  </strong>{" "}
                  with a total of{" "}
                  <span className="text-blue-700">{bestProtocol.val} </span>{" "}
                  Broadcasting for{" "}
                  <span className="text-blue-700">{nbrMsg} </span>{" "}
                  messages(T&B).
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Monitor;
