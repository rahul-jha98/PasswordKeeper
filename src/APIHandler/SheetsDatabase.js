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

  initialize = async (masterKey) => {
    this.encryptionHander.setKey(masterKey);

    const dataTableColumns = ['name', 'note', 'category', ...this.fields];
    await this.db.addTable('data', dataTableColumns);

    const categoryTableColumns = ['name', 'icon', ...this.fields];
    await this.db.addTable('categories', categoryTableColumns);

    await this.db.addTable('masterpassword', ['password'], 2);
    this.db.getTable('masterpassword').insertOne([this.encryptionHander.encrypt('nowyouseeme')], false);

    await this.db.getTable('categories').insertMany([
      ['Web Account', 'public', '@-Website Link', '$-Username', '*-Password'],
      ['Email', 'mail', '$-Email Account', '*-Password'],
      ['Credit Card', 'card', '$-Card Number', '$-Expiry Date', '*-CVV'],
      ['Shopping Website', 'shop', '$-E-Mail', '$-Phone Number', '*-Password'],
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

  insertPassword = async (details) => {
    const encryptedDetails = { ...details };
    this.fields.forEach((field) => {
      if (encryptedDetails[field].length) {
        encryptedDetails[field] = this.encryptionHander.encrypt(encryptedDetails[field]);
      }
    });
    await this.db.getTable('data').insertOne(encryptedDetails);
    this.notifyDataChanged('data');
  }

  getDataWithIndex = (tableName) => this.db.getTable(tableName).getData()
    .map((entry, idx) => ({ ...entry, row_idx: idx }));

  deleteAccountAtIndex = async (row_idx) => {
    await this.db.getTable('data').deleteRow(row_idx);
    this.notifyDataChanged('data');
  }

  updateAccount = async (updatedAccount) => {
    console.log(updatedAccount);
    const encryptedDetails = { ...updatedAccount };
    this.fields.forEach((field) => {
      if (encryptedDetails[field] && encryptedDetails[field].length) {
        encryptedDetails[field] = this.encryptionHander.encrypt(encryptedDetails[field]);
      }
    });
    console.log(this.db.getTable('data').columnNames);
    console.log(encryptedDetails);
    await this.db.getTable('data').updateRow(updatedAccount.row_idx, encryptedDetails);
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
    if (!decryptedDetails.note) decryptedDetails.note = '';
    console.log(decryptedDetails);
    return decryptedDetails;
  }
}
