import SheetsDatabase from 'sheets-database';
import EncryptionHandler from './EncryptionHandler';

export default class Database {
  constructor() {
    this.callbacksList = {};
    this.encryptionHandler = new EncryptionHandler();
    this.fields = Array.from({ length: 5 }, (_, i) => `field${i + 1}`);
  }

  /**
   * Set the spreadsheet id of the sheet that is to be used
   * as a database
   * @param {string} sheetsId spreasheet id
   */
  setFileId = (sheetsId) => {
    this.db = new SheetsDatabase(sheetsId);
  }

  /**
   * Set the oauth token for the user that has signed in which
   * will be used to access the sheet file
   * @param {string} token authToken for the user
   */
  setAccessToken = (token) => {
    this.db.useAccessToken(token);
  }

  /**
   * Establish connection with sheets API and fetch the data
   * into memory
   * @returns {boolean} whether the Sheet has been initialized before or not
   */
  connect = async () => {
    await this.db.sync();

    return this.db.tablesByIndex[0].title === 'Sheet1';
  }

  /**
   * Check if password is correct and if true sets it for the encryption handler
   * @param {string} password Password that needs to be validated
   * @returns {boolean} Whether the password is correct
   */
  verifyPassword = (password) => {
    const [[encryptedKey1], [encryptedKey2], [hashValue]] = this.db.getTable('preferences').getDataArray();

    return this.encryptionHandler
      .validateMasterKey(password, encryptedKey1, encryptedKey2, hashValue);
  }

  // METHODS FOR DATA TABLE /////////////////////////////////////////////////
  /**
   * Insert the account to the database and notify all
   * subscribed methods
   * @param {Object} account acount object
   */
  insertAccount = async (account) => {
    await this.db.getTable('data').insertOne(this.encryptFields(account));
    this.notifyDataChanged('data');
  }

  /**
   * Delete an account at a given index and notify subscribed methods of update
   * @param {number} row_idx index of account to be deleted
   */
  deleteAccountAtIndex = async (row_idx) => {
    await this.db.getTable('data').deleteRow(row_idx);
    this.notifyDataChanged('data');
  }

  /**
   * Update an account data
   * @param {Object} updatedAccount account object that contains row_idx
   */
  updateAccount = async (updatedAccount) => {
    await this.db.getTable('data').updateRow(updatedAccount.row_idx, this.encryptFields(updatedAccount));
    this.notifyDataChanged('data');
  }

  // METHODS FOR CATEGORIES TABLE /////////////////////////////////////////////////
  getCategories = () => this.db.getTable('categories').getData();

  getCategoriesIndexedByName = () => {
    const categoriesMappings = {};
    this.db.getTable('categories').getData().forEach((category) => {
      categoriesMappings[category.name] = category;
    });
    return categoriesMappings;
  }

  /**
   * Insert a category to the database
   * @param {Object} category category object
   */
    insertCategory = async (category) => {
      await this.db.getTable('categories').insertOne(category);
      this.notifyDataChanged('categories');
    }

  /**
   * Delete a category and its child component
   * @param {number} cateogry_idx row index of the category to be deleted
   * @param {function} notifyDataDeleted function that is called to notify that
   *  the data has been delted and now function will emit the updated data to the app
   */
  deleteCategory = async (cateogry_idx, notifyDataDeleted) => {
    // Get the name of the cateogry
    const categoryName = this.db.getTable('categories').getRow(cateogry_idx).name;
    // Delete all the entries in data table that belong to this category
    await this.db.getTable('data').deleteRowsWhere((data) => data.category === categoryName);
    // Delte category from categories table
    await this.db.getTable('categories').deleteRow(cateogry_idx);
    // Notify that data has been deleted
    notifyDataDeleted();
    // Notify the app that the data of both tables have been updated
    this.notifyDataChanged('data');
    this.notifyDataChanged('categories');
  }

  // HELPER METHODS ////////////////////////////////////////////
  /**
   * @callback tableUpdateCallback
   * @param {Array.<Object>} updatedList
   * Array of data which represents the latest data in the table
   */

  /**
   * Pass a function which will be called with a parameter containing latest
   * data and also called whenever you make a local change that fetches the data again.
   * @param {string} tableName name of the table
   * @param {tableUpdateCallback} cb Callback method to handle table updates
   */
  subscribeForTableUpdates = (tableName, cb) => {
    // If there is no key called tableName in callbacksList
    // we initialize it with empty array
    if (!this.callbacksList[tableName]) {
      this.callbacksList[tableName] = [];
    }
    // Then we push the callback to the list of callbacks
    this.callbacksList[tableName].push(cb);

    // Also, we return the current data to the callback
    cb(this.getDataWithIndex(tableName));
  }

  /**
   * @private
   * Call the subscribed callbacks for a table with the latest data of the table
   * @param {string} tableName Name of table whose data is changed
   */
  notifyDataChanged = (tableName) => {
    if (this.callbacksList[tableName]) {
      // If there is any callback for the table store the latest data
      const updatedData = this.getDataWithIndex(tableName);
      // Call all the callbacks for the given table with the latest data
      this.callbacksList[tableName].forEach((cb) => {
        cb(updatedData);
      });
    }
  }

  /**
   * Initialize the sheet with tables and data to be used as database
   * @param {string} masterKey The key that will be used for encryption
   */
  initialize = async (masterKey) => {
    // Set the key for encryption handler
    const data = this.encryptionHandler.encryptMasterKey(masterKey);
    const dataObject = data.map((val) => ({ value: val }));

    /**
     * First we create a table named data which will have the columns
     * name, category, note, field1, field2, field3, field4, field5
     *
     * It will be used to store all the accounts that the user adds
     */
    const dataTableColumns = ['name', 'category', 'note', ...this.fields];
    await this.db.addTable('data', dataTableColumns);

    /**
     * Next we create a table named categories which will have the columns
     * name, icon, field1, field2, field3, field4, field5
     *
     * It will be used to store the categories that the user has added
     */
    const categoryTableColumns = ['name', 'icon', ...this.fields];
    await this.db.addTable('categories', categoryTableColumns);

    /**
     * Finally to create a table named preferences which will have just one
     * column named value.
     */
    await this.db.addTable('preferences', ['value'], 4);
    this.db.getTable('preferences').insert(dataObject, false);

    // In the categories table we populate the set of initial categories
    await this.db.getTable('categories').insertMany([
      ['Web Account', 'public', '@-Website Link', '$-Username', '*-Password'],
      ['Email', 'mail', '$-Email Account', '*-Password'],
      ['Credit Card', 'card', '$-Card Number', '$-Expiry Date', '*-CVV'],
      ['Wifi Account', 'wifi', '$-Wifi Name', '*-Password'],
      ['Linked Account', 'link', '$-Connected Account'],
    ]);

    /**
     * If we react here it means we have successfully added all the requisite tables
     * We then delete Sheet1 table which is the default table created in sheet document
     * This process makes sure that the next time the app runs we do not call initialize process
     */
    await this.db.dropTable('Sheet1');
  }

  /**
   * Get the data of the table with added field called row_idx i.e. row index
   * @param {string} tableName name of the table whose data is needed
   */
  getDataWithIndex = (tableName) => this.db.getTable(tableName).getData()
    .map((entry, idx) => ({ ...entry, row_idx: idx }));

  /**
   * Checks if there exists entry in a table with given name
   * @param {string} tableName name of the table
   * @param {string} name name that needs to be checked
   * @returns {boolean} if there is an existing entry with the given name
   */
  checkNameExist = (tableName, name) => {
    if (this.db.getTable(tableName).getData().filter((rowData) => rowData.name === name).length) {
      return true;
    }
    return false;
  }

  /**
   * Encrypt the fields in account object
   * @param {Object} details account object
   * @returns {Object} account object with the fields encrypted
   */
  encryptFields = (details) => {
    const encryptedDetails = { ...details };
    this.fields.forEach((field) => {
      if (encryptedDetails[field] && encryptedDetails[field].length) {
        encryptedDetails[field] = this.encryptionHandler.encrypt(encryptedDetails[field]);
      }
    });

    return encryptedDetails;
  }

  /**
   * Decrypt the fields in account object
   * @param {Object} encryptedDetails account object
   * @returns {Object} account object with the fields decrypted
   */
  decryptFields = (encryptedDetails) => {
    if (!encryptedDetails) { return null; }
    const decryptedDetails = { ...encryptedDetails };

    this.fields.forEach((field) => {
      if (decryptedDetails[field]) {
        decryptedDetails[field] = this.encryptionHandler.decrypt(encryptedDetails[field]);
      } else {
        decryptedDetails[field] = '';
      }
    });
    if (!decryptedDetails.note) {
      decryptedDetails.note = '';
    }
    return decryptedDetails;
  }
}
