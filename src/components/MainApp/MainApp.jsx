import React from 'react';

import Snackbar from '@material-ui/core/Snackbar';

import AppLayout from './AppLayout';
import MasterKeyScreen from './MasterKeyScreen';

import ApiHandlerProvider from './provider/ApiHandlerProvider';
import Drive from '../../APIHandler/Drive';
import SheetsDatabase from '../../APIHandler/SheetsDatabase';

export default class MainApp extends React.Component {
  constructor(props) {
    super(props);
    this.drive = new Drive(this.props.authHandler);
    this.database = new SheetsDatabase();
    this.state = {
      loaded: false, toast: '', action: null, message: 'Connecting to Google Drive',
    };
  }

  componentDidMount = () => {
    this.drive.getFolder(() => {
      this.drive.getSheetFile(async (sheet_file_id) => {
        this.database.setFileId(sheet_file_id);
        this.database.setAccessToken(this.props.authHandler.getAuthToken());
        const shouldInitialize = await this.database.connect();

        if (shouldInitialize) {
          this.setState({ action: 'add' });
        } else {
          this.setState({ action: 'verify' });
        }
      });
    });
  }

  showToast = (toast) => {
    this.setState({ toast });
  }

  onPasswordLoaded = () => {
    this.setState({ loaded: true, action: null, message: 'Loading Data from Sheet' });
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
            ? <AppLayout />
            : (
              <MasterKeyScreen
                message={this.state.message}
                action={this.state.action}
                database={this.database}
                onPasswordLoaded={this.onPasswordLoaded}
              />
            ) }
        </ApiHandlerProvider>
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          open={Boolean(this.state.toast)}
          autoHideDuration={2000}
          message={this.state.toast}
          onClose={() => { this.setState({ toast: '' }); }}
          key={this.state.toast}
        />
      </>
    );
  }
}
