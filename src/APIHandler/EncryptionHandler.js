import CryptoJS from 'crypto-js';

/**
 * @class Class to handle all the encryption and decryption related stuff
 */
export default class EncryptionHandler {
  /**
   * Set the key that will be used for all further
   * AES encryption and decryptions
   * @param {string} key string that will be used
   */
  setKey = (key) => {
    this.key = key;
  }

  /**
   * Encrypt a text using AES encryption
   * @param {string} text the text that needs to be encrypted
   * @returns {string} the AES encrypted string
   */
  encrypt = (text) => CryptoJS.AES.encrypt(text, this.key).toString();

  /**
   * Decrypt an AES encrypted text
   * @param {string} encrypted the encrypted text that needs to be decrypted
   * @returns {string} the decrypted string
   */
  decrypt = (encrypted) => CryptoJS.AES.decrypt(encrypted, this.key).toString(CryptoJS.enc.Utf8);

  validate = (text, key, value) => CryptoJS.AES
    .decrypt(value, key)
    .toString(CryptoJS.enc.Utf8) === text
}
