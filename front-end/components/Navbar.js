import React, { useEffect, useState } from "react";
import Image from "next/image";
import Logo from "../public/logo.svg";
import LinkItem from "./LinkItem";
import axios from "axios";

const Navbar = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [errorMessage, setErrorMessage] = useState(false);

  const connectWallet = (publicKey) => {
    setIsConnected(true);
    setWalletAddress(publicKey);
    setShowModal(false);
    setPrivateKey("");
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handlePublicKeyChange = (event) => {
    setPublicKey(event.target.value);
  };

  const handlePrivateKeyChange = (event) => {
    setPrivateKey(event.target.value);
  };

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      const response = await axios.post(
        "http://localhost:5000/wallet/connect",
        {
          publicKey,
          privateKey,
        }
      );
      if (response.data.status) {
        localStorage.setItem("publicKey", publicKey);
        localStorage.setItem("privateKey", privateKey);
        connectWallet(publicKey);
      } else {
        // handle error message
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    const storedPublicKey = localStorage.getItem("publicKey");
    const storedPrivateKey = localStorage.getItem("privateKey");

    if (storedPublicKey && storedPrivateKey) {
      setPublicKey(storedPublicKey);
      setPrivateKey(storedPrivateKey);
      connectWallet(storedPublicKey);
    }
  }, []);

  return (
    <nav className="w-full h-18 bg-gray-800">
      <div className="flex items-center justify-between flex-wrap p-6">
        <div className="flex items-center flex-shrink-0 text-white mr-6 space-x-2">
          <Image src={Logo} alt="logo" />
          <span className="font-semibold text-xl tracking-tight text-white">
            WMcoin
          </span>
        </div>
        <div className="w-full block lg:flex lg:items-center lg:w-auto">
          <div className="text-sm lg:flex-grow">
            <LinkItem link="/" Item="Home" />
            <LinkItem link="/monitor" Item="Monitor" />
            <LinkItem link="/create" Item="Wallet" />
          </div>
          {isConnected ? (
            <>
              <LinkItem link="/transaction" Item="Transaction" />
              <LinkItem link="/mining" Item="Mining" />
              <LinkItem
                style="bg-red-500 hover:bg-red-600 text-white font-medium text-sm py-2 px-5 rounded-2xl ml-2"
                link="account"
                Item={
                  <span className="text-white ml-2">
                    0X{walletAddress.slice(0, 10)}
                  </span>
                }
              />
            </>
          ) : (
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium text-sm py-2 px-5 rounded-2xl ml-2"
              onClick={toggleModal}
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-10 rounded-lg w-96">
            <h2 className="text-2xl font-semibold mb-6 text-center text-blue-500">
              Connect Wallet
            </h2>
            <form>
              <div className="mb-6">
                <label
                  htmlFor="publicKey"
                  className="block text-lg font-semibold mb-2 text-gray-700"
                >
                  Public Key:
                </label>
                <input
                  type="text"
                  id="publicKey"
                  value={publicKey}
                  onChange={handlePublicKeyChange}
                  className="border rounded-lg px-4 py-2 w-full text-lg d border-gray-300 focus:border-blue-500 focus:outline-none border-solid"
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="privateKey"
                  className="block text-lg font-semibold mb-2 text-gray-700"
                >
                  Private Key:
                </label>
                <input
                  type="text"
                  id="privateKey"
                  value={privateKey}
                  onChange={handlePrivateKeyChange}
                  className="border rounded-lg px-4 py-2 w-full text-lg d border-gray-300 focus:border-blue-500 focus:outline-none border-solid"
                />
              </div>
              {errorMessage && (
                <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
              )}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-gray-700 hover:text-gray-900 font-semibold px-6 py-3 rounded-lg mr-4 border border-gray-300"
                  onClick={toggleModal}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg"
                  onClick={handleSubmit}
                >
                  Connect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
