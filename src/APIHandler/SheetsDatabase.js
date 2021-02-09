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
      const fields = [1, 2, 3, 4, 5, 6, 7, 8].map((x) => `field${x}`);
      const dataTableColumns = ['name', 'notes', 'category', ...fields];
      await this.db.addTable('data', dataTableColumns);

      const categoryTableColumns = ['name', 'icon', ...fields];
      await this.db.addTable('categories', categoryTableColumns);

      await this.db.dropTable('Sheet1');

      await this.db.getTable('categories').insertMany([
        ['Web Account', 'public', 'URL', 'Username', 'Password'],
        ['Email', 'email', 'Email Account', 'Password'],
      ]);
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

  getCategories = () => this.db.getTable('categories').getData();

  insertPassword = async (details) => {
    await this.db.getTable('data').insertOne(details);
    this.notifyDataUpdated('data');
  }
}
