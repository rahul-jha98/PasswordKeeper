import SheetsDatabase from 'sheets-database';
import EncryptionHandler from './EncryptionHandler';

export default class Database {
  constructor() {
    this.callbacksList = {};
    this.encryptionHander = new EncryptionHandler();
    this.fields = Array.from({ length: 5 }, (_, i) => `field${i + 1}`);
  }

  setFileId = (sheetsId) => {
    this.db = new SheetsDatabase(sheetsId);
  }

  setAccessToken = (token) => {
    this.db.useAccessToken(token);
  }

  connect = async () => {
    await this.db.sync();

    return this.db.tablesByIndex[0].title === 'Sheet1';
  }

  initialize = async (masterKey, setStatusLoading) => {
    this.encryptionHander.setKey(masterKey);

    const dataTableColumns = ['name', 'note', 'category', ...this.fields];
    await this.db.addTable('data', dataTableColumns);
    setStatusLoading();
    const categoryTableColumns = ['name', 'icon', ...this.fields];
    await this.db.addTable('categories', categoryTableColumns);

    await this.db.addTable('masterpassword', ['password'], 2);
    this.db.getTable('masterpassword').insertOne([this.encryptionHander.encrypt('nowyouseeme')], false);

    await this.db.getTable('categories').insertMany([
      ['Web Account', 'public', '@-Website Link', '$-Username', '*-Password'],
      ['Email', 'mail', '$-Email Account', '*-Password'],
      ['Credit Card', 'card', '$-Card Number', '$-Expiry Date', '*-CVV'],
      ['Wifi Account', 'wifi', '$-Name', '*-Password'],
      ['Linked Accounts', 'link', '$-Connected Account'],
    ]);

    await this.db.dropTable('Sheet1');
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

  encryptFields = (details) => {
    const encryptedDetails = { ...details };
    this.fields.forEach((field) => {
      if (encryptedDetails[field] && encryptedDetails[field].length) {
        encryptedDetails[field] = this.encryptionHander.encrypt(encryptedDetails[field]);
      }
    });
    if (encryptedDetails.note && encryptedDetails.note.length) {
      encryptedDetails.note = this.encryptionHander.encrypt(encryptedDetails.note);
    }

    return encryptedDetails;
  }

  insertPassword = async (details) => {
    await this.db.getTable('data').insertOne(this.encryptFields(details));
    this.notifyDataChanged('data');
  }

  getDataWithIndex = (tableName) => this.db.getTable(tableName).getData()
    .map((entry, idx) => ({ ...entry, row_idx: idx }));

  deleteAccountAtIndex = async (row_idx) => {
    await this.db.getTable('data').deleteRow(row_idx);
    this.notifyDataChanged('data');
  }

  updateAccount = async (updatedAccount) => {
    await this.db.getTable('data').updateRow(updatedAccount.row_idx, this.encryptFields(updatedAccount));
    this.notifyDataChanged('data');
  }

  verifyPassword = (password) => {
    const savedEncrypted = this.db.getTable('masterpassword').getRow(0).password;

    if (this.encryptionHander.validate('nowyouseeme', password, savedEncrypted)) {
      this.encryptionHander.setKey(password);
      return true;
    }
    return false;
  }

  getDecryptedAccount = (encryptedDetails) => {
    if (!encryptedDetails) { return null; }
    const decryptedDetails = { ...encryptedDetails };

    this.fields.forEach((field) => {
      if (decryptedDetails[field]) {
        decryptedDetails[field] = this.encryptionHander.decrypt(encryptedDetails[field]);
      } else {
        decryptedDetails[field] = '';
      }
    });
    if (decryptedDetails.note) this.encryptionHander.decrypt(encryptedDetails.note);
    else decryptedDetails.note = '';
    return decryptedDetails;
  }

  checkNameExist = (table, name) => {
    if (this.db.getTable(table).getData().filter((rowData) => rowData.name === name).length) {
      return true;
    }
    return false;
  }

  insertCategory = async (details) => {
    await this.db.getTable('categories').insertOne(details);
    this.notifyDataChanged('categories');
  }

  deleteCategory = async (cateogry_idx, notifyDataDeleted) => {
    console.log(cateogry_idx);
    const categoryName = this.db.getTable('categories').getRow(cateogry_idx).name;
    await this.db.getTable('data').deleteRowsWhere((data) => data.category === categoryName);
    await this.db.getTable('categories').deleteRow(cateogry_idx);
    notifyDataDeleted();
    this.notifyDataChanged('data');
    this.notifyDataChanged('categories');
  }
}
