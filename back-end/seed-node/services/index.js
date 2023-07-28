exports.hasAvilablePeers = (listPeers) => {
  if (listPeers.length !== 0) {
    return true;
  } else {
    return false;
  }
};

exports.getAddressPeer = async (req) => {
  return (
    (await req.headers["x-forwarded-for"]) || req.connection.remoteAddress
  ).replace(/^::ffff:/, "");
};

