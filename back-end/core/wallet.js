const EC = require("elliptic").ec;
class Wallet {
  constructor() {
    this.ec = new EC("secp256k1");
  }

  create() {
    const keyPair = this.ec.genKeyPair();
    const publicKey = keyPair.getPublic().encode("hex");
    const privateKey = keyPair.getPrivate("hex");
    return {
      address: publicKey,
      privateKey: privateKey,
    };
  }
  isValidaccount(publicKey, privateKey) {
    const keyPair = this.ec.keyFromPrivate(privateKey);
    if (keyPair.getPublic("hex") === publicKey) {
      return true;
    } else {
      return false;
    }
  }
}
const wallet = new Wallet();
module.exports = { Wallet, wallet };
