class Neighbors {
  constructor() {
    this.table = [];
    this.HelperTable = [];
  }
  push(id, nodes) {
    const index = this.table.findIndex((peer) => peer.id === id);
    if (index !== -1) {

      this.table[index].neighbors = nodes;
    } else {
      this.table.push({ id: id, neighbors: nodes });
    }
  }

  get() {
    return this.table;
  }
}
const neighbors = new Neighbors();
module.exports = neighbors;
