const Store = require('data-store');

const store = new Store('AWSDynamoDBDocumentClientTester');


class AWSDynamoDBDocumentClientMock {
  get() {
    store.load();

    return { promise: async ()=>store.data };
  }

  put(obj) {
    store.set(obj);
    store.writeFile();
    
    return { promise: async ()=>obj };
  }
}

module.exports = AWSDynamoDBDocumentClientMock;