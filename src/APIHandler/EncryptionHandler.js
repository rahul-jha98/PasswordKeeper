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
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()-=';

    for (let i = 0; i < len; i += 1) {
      key += chars.charAt(Math.floor(Math.random() * 74));
    }
    return key;
  }

  hash = (data, iterations) => {
    let hash = data;
    for (let i = 0; i < iterations; i += 1) {
      hash = SHA3(hash, {});
    }
    return hash.toString(encBase64);
  }

  encryptWithKey = (text, key) => AES.encrypt(text, key).toString();

  decryptWithKey = (text, key) => AES.decrypt(text, key).toString(UTF8);

  addSalt = (text, salt) => {
    let saltedText = '';
    const textSize = text.length;
    const saltSize = salt.length;
    for (let i = 0; i < textSize; i += 1) {
      const ascii = text.codePointAt(0);
      if (ascii % 2 === 1) {
        saltedText += salt[ascii % saltSize];
      } else {
        saltedText += ascii;
      }
    }
    console.log(text);
    console.log(saltedText);
    return saltedText;
  }

  validateMasterKey = (masterKeyToValidate, encryptedKey1, encryptedKey2, hashValue, salt) => {
    const hashedMasterKey = this.hash(masterKeyToValidate, 10000);
    const saltAddedKey = this.addSalt(hashedMasterKey, salt);
    const hashedSaltedKey = this.hash(saltAddedKey, 15000);

    const key1 = this.decryptWithKey(encryptedKey1, hashedSaltedKey);
    const key2 = this.decryptWithKey(encryptedKey2, hashedSaltedKey);
    if (this.hash(key1 + key2, 5000) === hashValue) {
      this.setKeys(masterKeyToValidate, key1, key2);
      return true;
    }
    return false;
  }

  encryptMasterKey = (masterKey, salt) => {
    const hashedMasterKey = this.hash(masterKey, 10000);
    const saltAddedKey = this.addSalt(hashedMasterKey, salt);
    const hashedSaltedKey = this.hash(saltAddedKey, 15000);
    const key1 = this.generate_key();
    const key2 = this.generate_key();

    const encryptedKey1 = this.encryptWithKey(key1, hashedSaltedKey);
    const encryptedKey2 = this.encryptWithKey(key2, hashedSaltedKey);
    const hashedKey = this.hash(key1 + key2, 5000);
    this.setKeys(masterKey, key1, key2);

    return [encryptedKey1, encryptedKey2, hashedKey];
  }
}
