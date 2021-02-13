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
      const dataTableColumns = ['name', 'note', 'category', ...fields];
      await this.db.addTable('data', dataTableColumns);

      const categoryTableColumns = ['name', 'icon', ...fields];
      await this.db.addTable('categories', categoryTableColumns);

      await this.db.dropTable('Sheet1');

      await this.db.getTable('categories').insertMany([
        ['Web Account', 'public', 'Website Link', 'Username', 'Password'],
        ['Email', 'mail', 'Email Account', 'Password'],
        ['Credit Card', 'card', 'Card Number', 'Expiry Date', 'CVV'],
        ['Shopping Website', 'shop', 'E-Mail', 'Phone Number', 'Password'],
      ]);
    }
  }

  subscribeForTableUpdates = (tableName, cb) => {
    if (this.callbacksList[tableName]) {
      this.callbacksList[tableName].push(cb);
    } else {
      this.callbacksList[tableName] = [cb];
    }

    cb(this.getDataWithIndex(tableName));
  }

  notifyDataChanged = (tableName) => {
    if (this.callbacksList[tableName]) {
      const updatedData = this.getDataWithIndex(tableName);
      this.callbacksList[tableName].forEach((cb) => {
        cb(updatedData);
      });
    }
  }

  getCategories = () => this.db.getTable('categories').getData();

  insertPassword = async (details) => {
    await this.db.getTable('data').insertOne(details);
    this.notifyDataChanged('data');
  }

  getDataWithIndex = (tableName) => this.db.getTable(tableName).getData()
    .map((entry, idx) => ({ ...entry, row_idx: idx }));

  deleteAccountAtIndex = async (row_idx) => {
    await this.db.getTable('data').deleteRow(row_idx);
    this.notifyDataChanged('data');
  }

  updateAccount = async (updatedAccount) => {
    await this.db.getTable('data').updateRow(updatedAccount.row_idx, updatedAccount);
  }
}
