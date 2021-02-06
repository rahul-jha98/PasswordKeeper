/* eslint-disable import/no-anonymous-default-export */
import React from 'react';

import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';

import AddIcon from '@material-ui/icons/Add';

import AppBarPopoverMenu from './AppBarPopoverMenu';
import ApiHandlerContext from '../provider/ApiHandlerContext';

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
    textAlign: 'left',
    verticalAlign: 'bottom',
  },
  small: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
}));

export default ({ className, children }) => {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const { authHandler } = React.useContext(ApiHandlerContext);
  const user = authHandler.getUser();
  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar position="fixed" className={className}>
        <Toolbar>
          {children}

          <Tooltip title="Add New Audio" disableHoverListener>
            <IconButton
              aria-label="add-audio"
              aria-controls="menu-appbar"
              color="inherit"
            >
              <AddIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Menu" disableHoverListener>
            <IconButton
              aria-label="about"
              aria-controls="menu-appbar"
              color="inherit"
              aria-owns={anchorEl ? 'mouse-over-popover' : undefined}
              aria-haspopup="true"
              onClick={handlePopoverOpen}
            >
              <Avatar className={classes.small} src={user.getImageUrl()} />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <AppBarPopoverMenu user={user} handlePopoverClose={handlePopoverClose} anchorEl={anchorEl} />
    </>
  );
};
