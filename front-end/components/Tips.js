import React from "react";

const Tips = () => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Tips:</h2>
      <ul className="list-disc list-inside">
        <li className="mb-2">
          Make sure you have enough balance to send the transaction.
        </li>
        <li className="mb-2">
          Double check the recipients address before sending the transaction.
        </li>
        <li className="mb-2">
          The gas price determines the speed of the transaction. A higher gas
          price means the transaction will be processed faster, but will cost
          more.
        </li>
      </ul>
    </div>
  );
};

export default Tips;
