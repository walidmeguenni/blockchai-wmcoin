import React from "react";

const TipsAccount = () => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Tips:</h2>
      <ul className="list-disc list-inside">
        <li className="mb-2">
          Store your private key in a safe place, such as a password manager or
          a physical vault.
        </li>
        <li className="mb-2">
          Do not share your private key with anyone, as it grants access to your
          wallet and funds.
        </li>
        <li className="mb-2">
          Use a strong password and enable two-factor authentication to protect
          your account.
        </li>
      </ul>
    </div>
  );
};

export default TipsAccount;
