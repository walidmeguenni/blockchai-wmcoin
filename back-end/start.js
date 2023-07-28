
class Start {
  constructor(protocol = "olsr", analysis = "transaction") {
    this.port="";
    this.protocol = protocol;
    this.analysis = analysis;
  }
}

const start = new Start();
module.exports = start;
