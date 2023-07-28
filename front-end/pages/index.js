import axios from "axios";
import { BlocksTable, TransactionTable } from "@/components";
const Home = ({ Blocks, Transactions }) => {
  return (
    <div className="mx-auto max-w-7xl p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8"> Transactions and Blocks</h1>

      <div className="grid grid-cols-1 gap-8">
        <BlocksTable data={Blocks} title="Blocks" />
        <TransactionTable data={Transactions} title="Transactions" />
      </div>
    </div>
  );
};

export async function getServerSideProps() {
  let Blocks = [];
  let Transactions = [];

  try {
    const blocksResponse = await axios.get("http://localhost:5000/block/all");
    Blocks = blocksResponse.data.Blockchain;
  } catch (error) {
    console.log("Error fetching blocks:", error);
  }

  try {
    const transactionsResponse = await axios.get(
      "http://localhost:5000/transaction/all"
    );
    Transactions = transactionsResponse.data.Transactions;
  } catch (error) {
    console.log("Error fetching transactions:", error);
  }

  return {
    props: {
      Blocks,
      Transactions,
    },
  };
}

export default Home;
