import React, { useState } from "react";
import axios from "axios";
function AccountForm() {
  const [wallet, setWallet] = useState({});
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get("http://localhost:5000/wallet/create");
      const newWallet = response.data.wallet;
      setWallet(newWallet);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Create New Wallet</h1>
      <form className="flex flex-col items-center">
        <div className="mb-4">
          <button
            type="button"
            className="py-2 px-4 bg-gray-700 text-white rounded-md hover:bg-gray-800"
            onClick={handleSubmit}
          >
            Generate New Wallet
          </button>
        </div>
      </form>
      {wallet.address && (
        <div className="bg-gray-100 p-4 rounded-lg mt-4">
          <p className="text-gray-700 mb-2">
            <span className="font-bold">Address:</span> {wallet.address}
          </p>
          <p className="text-gray-700 mb-2">
            <span className="font-bold">Private Key:</span> {wallet.privateKey}
          </p>
        </div>
      )}
    </div>
  );
}

export default AccountForm;
