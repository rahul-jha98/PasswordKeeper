import { gapi } from 'gapi-script';

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const API_KEY = process.env.REACT_APP_API_KEY;

// Array of API discovery doc URLs for APIs
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
const SCOPES = 'https://www.googleapis.com/auth/drive';

class Auth {
  constructor() {
    this.user = null;
  }

  onSignInWithGoogle = (onUserSignInChanged, onUserSignInFailed) => {
    this.onUserSignInChanged = onUserSignInChanged;
    this.onUserSignInFailed = onUserSignInFailed;

    gapi.load('client:auth2', this.initializeClient);
  }

  signOutFromGoogle = () => {
    gapi.auth2.getAuthInstance().signOut();
  }

  signInWithGoogle = () => {
    gapi.auth2.getAuthInstance().signIn().catch((err) => {
      this.onUserSignInFailed(err);
    });
  };

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

  getGAPIClient = () => gapi;

  getAuthToken = () => this.access_token;
}

export default Auth;
