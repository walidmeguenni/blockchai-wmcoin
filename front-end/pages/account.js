import React, { useEffect, useState } from "react";
import axios from "axios";
import { BlocksTable, TransactionTable } from "@/components";
import { useRouter } from "next/router";

function Account() {
  const [publicKey, setPublicKey] = useState();
  const [privateKey, setPrivateKey] = useState("");
  const [balance, setBalance] = useState(0);
  const [confirmedTransactions, setConfirmedTransactions] = useState([]);
  const [unconfirmedTransactions, setUnconfirmedTransactions] = useState([]);
  const [recievedTransactions, setRecievedTransactions] = useState([]);
  const [minedBlocks, setMinedBlocks] = useState([]);
  const router = useRouter();

  const handleDisconnect = async () => {
    try {
      await axios.post("http://localhost:5000/mining/stop");

      localStorage.removeItem("publicKey");
      localStorage.removeItem("privateKey");
      setPublicKey("");
      setPrivateKey("");
      setBalance(0);
      setConfirmedTransactions([]);
      setUnconfirmedTransactions([]);
      setMinedBlocks([]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        const res = await axios.post("http://localhost:5000/wallet/info", {
          publicKey: localStorage.getItem("publicKey"),
        });
        setBalance(res.data.balance);
        setConfirmedTransactions(res.data.confirmedTransactions);
        setRecievedTransactions(res.data.recievedTranasaction);
        setUnconfirmedTransactions(res.data.unconfirmedTransactions);
        setMinedBlocks(res.data.minedBlocks);
        console.log(res.data)
      } catch (error) {
        console.log("Error fetching account data:", error);
      }
    };
    if (
      localStorage.getItem("publicKey") &&
      localStorage.getItem("privateKey")
    ) {
      setPublicKey(`0x${localStorage.getItem("publicKey").slice(0, 64)}`);
      setPrivateKey(localStorage.getItem("privateKey"));
      fetchAccountData();
    } else {
      router.push("/");
    }
  }, [router]);
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl  text-gray-800 font-bold mb-8">Account</h2>
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div>
          <div className="mb-4">
            <span className="text-xl font-semibold text-blue-800 tracking-wide">
              Public Key:{" "}
            </span>
            <span className="text-base font-normal text-red-500 ">
              {publicKey}
            </span>
          </div>
          <div className="mb-4">
            <span className="text-xl font-semibold text-blue-700 tracking-wide">
              Private Key:{" "}
            </span>
            <span className="text-base font-normal text-red-500 ">
              {privateKey}
            </span>
          </div>
          <div className="mb-4">
            <span className="text-xl font-semibold text-blue-700 tracking-wide">
              Balance:{" "}
            </span>
            <span className="text-base font-normal text-red-500 ">
              {balance}
            </span>
          </div>
        </div>

        <div className="flex justify-end">
          <form onSubmit={handleDisconnect}>
            <button className="bg-red-500 hover:bg-red-600 text-white font-medium text-sm py-2 px-5 rounded-2xl mt-4">
              Disconnect
            </button>
          </form>
        </div>
      </div>
      {confirmedTransactions  && (
        <TransactionTable
          data={confirmedTransactions}
          title="Confirmed Transactions"
        />
      )}
       {unconfirmedTransactions && (
        <TransactionTable
          data={unconfirmedTransactions}
          title="unconfirmed Transactions"
        />
      )}
      { recievedTransactions  && (
        <TransactionTable
          data={recievedTransactions}
          title="received  Transactions"
        />
      )}
      {minedBlocks  && (
        <BlocksTable data={minedBlocks} title="Mined Bolck" />
      )}
    </div>
  );
}

export default Account;
