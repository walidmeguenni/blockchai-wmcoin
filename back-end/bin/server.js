const app = require("../rpc/app");
const http = require("http");
const { startApp } = require("../ws/connect");
const { startWebSocketServer } = require("../ws/socket");
const { shape } = require("../services");
const start = require("../start");
const getPort = require("get-port");
const { Node } = require("../core/Peer");

function args() {
  return new Promise(async (resolve, reject) => {
    try {
      const additionalArgs = process.argv.slice(2);
      const additionalArgsObj = additionalArgs.reduce((obj, arg) => {
        const [key, value] = arg.split("=");
        obj[key.replace("--", "")] = value;
        return obj;
      }, {});

      start.port = additionalArgsObj.port
        ? additionalArgsObj.port
        : await getPort();

      if (additionalArgsObj.protocol) {
        start.protocol = additionalArgsObj.protocol;
      }

      if (additionalArgsObj.analysis) {
        start.analysis = additionalArgsObj.analysis;
      }
      Node.setAddress(start.port);
      Node.generateId();
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}

async function main() {
  await args();
  startApp();

  app.set("port", start.port);

  const server = http.createServer(app);

  startWebSocketServer(server);

  server.listen(start.port, () => {
    console.log(shape);
    console.log(
      `#----------Node Listening On Port http://localhost:${start.port}`
    );
    console.log("#");
    console.log("#");
    console.log("#");
    console.log("#");
  });
}
main();
