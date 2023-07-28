#!/usr/bin/env node
const axios = require("axios");
const { program } = require("commander");

program //start mining
  .command("start-mining")
  .description("Start mining")
  .option("-a, --address <address>", "Wallet address")
  .option("-p, --private-key <string>", "Wallet private key")
  .action((options) => {
    const { address, privateKey } = options;
    axios
      .post("http://localhost:5000/mining/start", {
        walletAddress: address,
        privateKey,
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  });

program  //stop mining
  .command("stop-mining")
  .description("Stop mining")
  .action(async () => {
    try {
       await axios.get("http://localhost:5000/mining/stop");
        console.log("mining stoped .. ")
    } catch (error) {
      console.error(error.message);
    }
  });
program.parse(process.argv);
