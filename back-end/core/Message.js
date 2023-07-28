class Message {
  static createMessage(id, type, data, address, status) {
    const message = {};

    if (id !== undefined) {
      message.id = id;
    }

    if (type !== undefined) {
      message.type = type;
    }

    if (data !== undefined) {
      message.data = data;
    }

    if (address !== undefined) {
      message.address = address;
    }

    if (status !== undefined) {
      message.status = status;
    }

    return JSON.stringify(message);
  }
  static recieveMessageOnTerminal(address, type) {
    console.log("#");
    console.log("#");
    console.log("#");
    console.log("#");
    console.log(
      `#----------Riceive message from ${address}: Type message received: ${type}`
    );
  }
}
module.exports = Message;
