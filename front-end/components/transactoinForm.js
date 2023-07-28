import React, { useState } from "react";
import axios from "axios";

function TransactionForm() {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [gas, setGas] = useState("");
  const [status, setStatus] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/transaction/send", {
        from: localStorage.getItem("publicKey"),
        to,
        amount,
        gas,
        privateKey: localStorage.getItem("privateKey"),
      });
      setStatus(true);
    } catch (error) {
      setStatus(false);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="to"
              className="block mb-2 text-sm font-bold text-gray-700  border-gray-300 focus:border-blue-500 focus:outline-none border-solid"
            >
              To
            </label>
            <input
              type="text"
              name="to"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full px-3 py-2 border rounded  focus:shadow-outline   border-gray-300 focus:border-blue-500 focus:outline-none border-solid"
              placeholder="To"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="amount"
              className="block mb-2 text-sm font-bold text-gray-700"
            >
              Amount
            </label>
            <input
              type="text"
              name="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border rounded  focus:shadow-outline   border-gray-300 focus:border-blue-500 focus:outline-none border-solid"
              placeholder="Amount"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="gas"
              className="block mb-2 text-sm font-bold text-gray-700"
            >
              Gas
            </label>
            <input
              type="text"
              name="gas"
              value={gas}
              onChange={(e) => setGas(e.target.value)}
              className="w-full px-3 py-2 border rounded  focus:shadow-outline   border-gray-300 focus:border-blue-500 focus:outline-none border-solid"
              placeholder="Gas"
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Send Transaction
            </button>
          </div>
        </form>
        {status && (
          <div className="mt-4">
            <p className="text-green-500 font-medium text-center">
              Transaction sent successfully!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TransactionForm;
