import CryptoJS from 'crypto-js';

export default class EncryptionHandler {
  setKey = (key) => {
    this.key = key;
  }

  encrypt = (text) => CryptoJS.AES.encrypt(text, this.key).toString();

  decrypt = (encoded) => CryptoJS.AES.decrypt(encoded, this.key).toString(CryptoJS.enc.Utf8);

  validate = (text, key, value) => CryptoJS.AES
    .decrypt(value, key)
    .toString(CryptoJS.enc.Utf8) === text
}
