import React from 'react';

export default class HomePage extends React.Component {
  handleGoogleSignIn = () => {
    this.props.authHandler.signInWithGoogle();
  }

  render() {
    return (
      <div>
        <button type="button" onClick={this.handleGoogleSignIn}>Sign In</button>
      </div>
    );
  }
}
