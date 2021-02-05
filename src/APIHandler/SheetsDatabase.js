import SheetsDatabase from 'sheets-database';

export default class Database {
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
}
