import { AccountForm, TipsAccount } from "../components";

export default function Account() {
  return (
    <div className="mx-auto max-w-4xl p-4">
      <h1 className="text-3xl font-bold mb-4">Account</h1>
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2">Generate a new wallet</h2>
        <p className="text-gray-600 mb-4">
          Enter a password to generate a new wallet.
        </p>
        <AccountForm />
      </div>
      <TipsAccount/>
    </div>
  );
}
