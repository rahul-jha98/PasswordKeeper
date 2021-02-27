import AES from 'crypto-js/aes';
import SHA3 from 'crypto-js/sha3';
import UTF8 from 'crypto-js/enc-utf8';
import encBase64 from 'crypto-js/enc-base64';

/**
 * @class Class to handle all the encryption and decryption related stuff
 */
export default class EncryptionHandler {
  /**
   * Set the key that will be used for all further
   * AES encryption and decryptions
   * @param {string} key string that will be used
   */
  setKeys = (masterKey, key1, key2) => {
    this.key = masterKey + key1;
    this.prefix = key2;
  }

  /**
   * Encrypt a text using AES encryption
   * @param {string} text the text that needs to be encrypted
   * @returns {string} the AES encrypted string
   */
  encrypt = (text) => AES.encrypt(this.prefix + text, this.key).toString();

  /**
   * Decrypt an AES encrypted text
   * @param {string} encrypted the encrypted text that needs to be decrypted
   * @returns {string} the decrypted string
   */
  decrypt = (encrypted) => AES
    .decrypt(encrypted, this.key)
    .toString(UTF8)
    .slice(this.prefix.length);

  generate_key = () => {
    const len = Math.floor((Math.random() * 10) + 28);
    let key = '';
    const hex = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()-=';

    for (let i = 0; i < len; i += 1) {
      key += hex.charAt(Math.floor(Math.random() * 74));
    }
    return key;
  }

  hash = (data) => SHA3(data, {})
    .toString(encBase64)

  encryptWithKey = (text, key) => AES.encrypt(text, key).toString();

  decryptWithKey = (text, key) => AES.decrypt(text, key).toString(UTF8);

  validateMasterKey = (masterKeyToValidate, encryptedKey1, encryptedKey2, hashValue) => {
    const key1 = this.decryptWithKey(encryptedKey1, masterKeyToValidate);
    const key2 = this.decryptWithKey(encryptedKey2, masterKeyToValidate);
    if (this.hash(key1 + key2) === hashValue) {
      this.setKeys(masterKeyToValidate, key1, key2);
      return true;
    }
    return false;
  }

  encryptMasterKey = (masterKey) => {
    const key1 = this.generate_key();
    const key2 = this.generate_key();
    console.log(key1);
    console.log(key2);
    const encryptedKey1 = this.encryptWithKey(key1, masterKey);
    const encryptedKey2 = this.encryptWithKey(key2, masterKey);
    const hashedKey = this.hash(key1 + key2);
    console.log(hashedKey);
    this.setKeys(masterKey, key1, key2);

    return [encryptedKey1, encryptedKey2, hashedKey];
  }
}
