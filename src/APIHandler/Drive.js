/**
 * @class API Wrapper to interact with Google Drive API
 */
class Drive {
  /**
   * Create a Drive object using given authClient
   * @constructor
   * @param {Object} authClient Object of Auth class
   */
  constructor(authClient) {
    this.authClient = authClient;
    this.gapi = this.authClient.getGAPIClient();
  }

  /**
   * @callback fileLoadCallback
   * @param {string} id file id of file in drive
   */

  /**
   * Returns the folder id of the app folder name.
   * In case folder doesn't exist it creates the folder
   * @param {fileLoadCallback} onFolderLoaded Callback to handle when folder loaded
   */
  getFolder = (onFolderLoaded) => {
    const folderName = 'drivepasswordmanager2';

    this.gapi.client.drive.files
      .list({
        q: `name='${folderName}'`,
      })
      .then((res) => {
        if (res.result.files.length) {
          // If there is a folder with given name we return the id
          // of the first folder that matches
          this.folder_id = res.result.files[0].id;
          onFolderLoaded(this.folder_id);
        } else {
          // If no folder is found we create a folder
          this.createFolder(folderName, onFolderLoaded);
        }
      });
  }

  /**
   * @private
   * Function to create a folder with give folder name
   * @param {string} folderName Name of the folder we wish to create
   * @param {fileLoadCallback} onFolderLoaded Callback to handle when folder is loaded
   */
  createFolder = (folderName, onFolderLoaded) => {
    const fileMetadata = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
    };
    this.gapi.client.drive.files.create({
      resource: fileMetadata,
      fields: 'id',
    }).then((res) => {
      this.folder_id = res.result.id;
      onFolderLoaded(this.folder_id);
    });
  }

  /**
   * Returns the sheet id of the file
   * If no file is found it creates a file
   * @param {fileLoadCallback} onFileLoaded Callback to handle when file is loaded
   */
  getSheetFile = (onFileLoaded) => {
    const fileName = 'password-database-alpha';
    this.gapi.client.drive.files
      .list({
        q: `name='${fileName}' and parents in '${this.folder_id}'`,
        fields: 'files/webViewLink',
      })
      .then((res) => {
        if (res.result.files.length) {
          const fileUrl = res.result.files[0].webViewLink;
          const fileId = this.getFileIdFromUrl(fileUrl);
          onFileLoaded(fileId);
        } else {
          this.createSheetFile(fileName, onFileLoaded);
        }
      });
  }

  /**
   * @private
   * Function to create a sheet file with given file name
   * @param {string} fileName Name of the sheet file to create
   * @param {fileLoadCallback} onFileLoaded Callback to handle when file is loaded
   */
  createSheetFile = (fileName, onFileLoaded) => {
    const fileMetadata = {
      name: fileName,
      mimeType: 'application/vnd.google-apps.spreadsheet',
      parents: [this.folder_id],
    };
    this.gapi.client.drive.files.create({
      resource: fileMetadata,
      fields: 'webViewLink',
    }).then((res) => {
      const fileUrl = res.result.webViewLink;
      const fileId = this.getFileIdFromUrl(fileUrl);
      onFileLoaded(fileId);
    });
  }

  /**
   * extract the file id from the file's web view link
   * Currently, webviewlinks are of the format
   * https://docs.google.com/spreadsheets/d/{fileId}/...
   * @param {string} fileUrl Web view link of the sheet file
   * @returns {string} Spreadsheet Id of the sheet file
   */
  getFileIdFromUrl = (fileUrl) => fileUrl.split('/')[5];
}
export default Drive;
