import React from "react";

const TransactionTable = ({ data, title }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">{title}</h3>
      {data.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-4 text-left">From</th>
                <th className="px-6 py-4 text-left">To</th>
                <th className="px-6 py-4 text-left">Amount</th>
                <th className="px-6 py-4 text-left">Gas</th>
              </tr>
            </thead>
            <tbody>
              {data.map((transaction) => (
                <tr key={transaction.id} className="border-b border-gray-300">
                  <td className="px-6 py-4 truncate">
                    0x{transaction.from.slice(0, 10)}
                  </td>
                  <td className="px-6 py-4 truncate">
                    0x{transaction.to.slice(0, 10)}
                  </td>
                  <td className="px-6 py-4">{transaction.amount}</td>
                  <td className="px-6 py-4">{transaction.gas}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500">No transactions found.</p>
      )}
    </div>
  );
};

export default TransactionTable;
