import React from "react";

const BlocksTable = ({ data, title }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">{title}</h3>
      {data.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border border-gray-300 ">
            <thead>
              <tr className="bg-gray-100 ">
                <th className="px-6 py-4 text-left">Block Number</th>
                <th className="px-6 py-4 text-left">Prev Hash</th>
                <th className="px-6 py-4 text-left">Timestamp</th>
                <th className="px-6 py-4 text-left">Nonce</th>
                <th className="px-6 py-4 text-left">Transactions</th>
                <th className="px-6 py-4 text-left">Hash</th>
              </tr>
            </thead>
            <tbody>
              {data.map((block) => (
                <tr key={block.hash} className="border-b border-gray-300">
                  <td className="px-6 py-4">{block.index}</td>
                  <td className="px-6 py-4 truncate">
                    0x{block.prevHash && block.prevHash.slice(0, 10)}
                  </td>
                  <td className="px-6 py-4">{block.timestamp}</td>
                  <td className="px-6 py-4">{block.nonce}</td>
                  <td className="px-6 py-4">{block.transactions.length}</td>
                  <td className="px-6 py-4 truncate">
                    0x{block.hash.slice(0, 10)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500">No blocks found.</p>
      )}
    </div>
  );
};

export default BlocksTable;
