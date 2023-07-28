import { useState } from "react";
import axios from "axios";
const MiningForm = () => {
  const [miningStatus, setMiningStatus] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      localStorage.getItem("privateKey");
      const response = await axios.post("http://localhost:5000/mining/start", {
        walletAddress: localStorage.getItem("publicKey"),
        privateKey: localStorage.getItem("privateKey"),

        // password: password,
      });
      console.log(response.data.status);
      setMiningStatus(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleStopMining = async () => {
    try {
      const response = await axios.post("http://localhost:5000/mining/stop");
      setMiningStatus(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="bg-white shadow-2xl rounded-lg p-6 w-96">
      <h2 className="text-lg font-medium mb-4">Start Mining</h2>
      <form>
        <div className="mb-4">
          
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg mr-4"
            type="button"
            onClick={handleSubmit}
          >
            Start Mining
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg"
            type="button"
            onClick={handleStopMining}
          >
            Stop Mining
          </button>
        </div>
      </form>

      <div className="mt-4">
        {miningStatus && (
          <p className="text-green-500 font-medium">Mining start...</p>
        )}
      </div>
    </div>
  );
};

export default MiningForm;
