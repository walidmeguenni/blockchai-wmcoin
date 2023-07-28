import { MiningForm } from "../components";

const Mining = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Mining</h1>
      <div className="flex justify-between mb-4">
        <div className="w-1/2">
          <MiningForm />
        </div>
        <div className="w-1/2 ml-8">
          <h2 className="text-lg font-bold mb-2">
            Tips for successful mining:
          </h2>
          <ul className="list-disc list-inside">
            <li>Use a powerful computer with a good graphics card</li>
            <li>
              Choose a mining pool to increase your chances of finding a block
            </li>
            <li>
              Monitor your hardware and software to ensure they are functioning
              properly
            </li>
            <li>
              Consider the cost of electricity when deciding whether to mine or
              not
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Mining;
