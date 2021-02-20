import { gapi } from 'gapi-script';

// Getting client id and api key environemnt variables
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const API_KEY = process.env.REACT_APP_API_KEY;

// Array of API discovery doc URLs for APIs
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];

// Authorization scopes required by the API;
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

class Auth {
  constructor() {
    this.user = null;
  }

  // Initialize the gapi client
  initializeClient = () => {
    gapi.client
      .init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      })
      .then(() => {
        gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSignInStatus);

        this.updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      })
      .catch((err) => {
        this.onUserSignInFailed(err);
      });
  }

  /**
   *
   * @param {function} onUserSignInChanged
   * callback that is called when sign in status changes
   *
   * @param {function} onUserSignInFailed
   * callback called when sign in fails
   */
  onSignInWithGoogle = (onUserSignInChanged, onUserSignInFailed) => {
    this.onUserSignInChanged = onUserSignInChanged;
    this.onUserSignInFailed = onUserSignInFailed;

    gapi.load('client:auth2', this.initializeClient);
  }

  signInWithGoogle = () => {
    gapi.auth2.getAuthInstance().signIn().catch((err) => {
      this.onUserSignInFailed(err);
    });
  };

  signOutFromGoogle = () => {
    gapi.auth2.getAuthInstance().signOut();
  }

  /**
   * @private
   * Function called when sign in status changes
   * @param {boolean} isSignedIn Whether any user is signed in
   */
  updateSignInStatus = (isSignedIn) => {
    if (isSignedIn) {
      this.access_token = gapi.auth2.getAuthInstance()
        .currentUser.get()
        .getAuthResponse().access_token;
      // Pass the user object to notify user has signed in
      this.onUserSignInChanged(gapi.auth2.getAuthInstance()
        .currentUser.get().getBasicProfile());
    } else {
      // prompt user to sign in
      this.onUserSignInChanged(null);
    }
  };

  getUser = () => gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile();

  getGAPIClient = () => gapi;

  getAuthToken = () => this.access_token;
}

export default Auth;
