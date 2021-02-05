/* eslint-disable no-await-in-loop */
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
   * @callback folderLoadCallback
   * @param {string} id folder id of the folder with app name
   */

  /**
   * Returns the folder id of the app folder name.
   * In case folder doesn't exist it creates the folder
   * @param {folderLoadCallback} onFolderLoaded Callback to handle when folder loaded
   */
  getFolder = (onFolderLoaded) => {
    const folderName = 'drivepasswordmanager';

    this.gapi.client.drive.files
      .list({
        q: `name='${folderName}'`,
      })
      .then((res) => {
        if (res.result.files.length) {
          this.folder_id = res.result.files[0].id;
          onFolderLoaded(this.folder_id);
        } else {
          this.createFolder(folderName, onFolderLoaded);
        }
      });
  }

  /**
   * Function to create a folder with give folder name
   * @param {string} folderName Name of the folder we wish to create
   * @param {folderLoadCallback} onFolderLoaded Callback to handle when folder is loaded
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

  getSheetFile = (onFileLoaded) => {
    const fileName = 'database';
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

  getFileIdFromUrl = (fileUrl) => fileUrl.split('/')[5];

  createSheetFile = (fileName, onFileLoaded) => {
    console.log('Creating file');
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
}
export default Drive;
