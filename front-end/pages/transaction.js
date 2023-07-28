import { Tips, TransactionForm } from "../components";

export default function Transaction() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        Send Transaction
      </h1>
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
        <div className="w-full md:w-1/2">
          <TransactionForm />
        </div>
        <div className="w-full md:w-1/2">
          <Tips />
        </div>
      </div>
    </div>
  );
}
