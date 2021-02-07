import SheetsDatabase from 'sheets-database';

export default class Database {
  callbacksList = {};

  setFileId = (sheetsId) => {
    this.db = new SheetsDatabase(sheetsId);
  }

  setAccessToken = (token) => {
    this.db.useAccessToken(token);
  }

  initialize = async () => {
    await this.db.sync();

    if (this.db.tablesByIndex[0].title === 'Sheet1') {
      await this.db.addTable('data', ['name', 'url', 'user_name', 'password']);
      await this.db.dropTable('Sheet1');
    }
  }

  subscribeForTableUpdates = (tableName, cb) => {
    if (this.callbacksList[tableName]) {
      this.callbacksList[tableName].push(cb);
    } else {
      this.callbacksList[tableName] = [cb];
    }

    cb(this.db.getTable(tableName).getData());
  }

  notifyDataUpdated = (tableName) => {
    if (this.callbacksList[tableName]) {
      const updatedData = this.db.getTable(tableName).getData();
      this.callbacksList[tableName].forEach((cb) => {
        cb(updatedData);
      });
    }
  }
}
