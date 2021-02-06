import React from 'react';

import Snackbar from '@material-ui/core/Snackbar';

import AppContent from './AppContent';
import LoadingScreen from './LoadingScreen';

import ApiHandlerProvider from './provider/ApiHandlerProvider';
import Drive from '../../APIHandler/Drive';
import SheetsDatabase from '../../APIHandler/SheetsDatabase';

export default class MainApp extends React.Component {
  constructor(props) {
    super(props);
    this.drive = new Drive(this.props.authHandler);
    this.database = new SheetsDatabase();
    this.state = { loaded: false, message: '' };
  }

  componentDidMount = () => {
    console.log(this.database);
    this.drive.getFolder(() => {
      this.drive.getSheetFile(async (sheet_file_id) => {
        this.database.setFileId(sheet_file_id);
        this.database.setAccessToken(this.props.authHandler.getAuthToken());
        await this.database.initialize();
        this.setState({ loaded: true });
      });
    });
  }

  showToast = (message) => {
    this.setState({ message });
  }

  render() {
    return (
      <>
        <ApiHandlerProvider
          authHandler={this.props.authHandler}
          showToast={this.showToast}
          database={this.database}
        >
          { this.state.loaded
            ? <AppContent />
            : <LoadingScreen message="Connecting to Google Drive" /> }
        </ApiHandlerProvider>
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          open={Boolean(this.state.message)}
          autoHideDuration={2000}
          message={this.state.message}
          onClose={() => { this.setState({ message: '' }); }}
          key={this.state.message}
        />
      </>
    );
  }
}
