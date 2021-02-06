/* eslint-disable import/no-anonymous-default-export */
import React from 'react';

import Popover from '@material-ui/core/Popover';
import CardHeader from '@material-ui/core/CardHeader';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';

import DarkModeIcon from '@material-ui/icons/Brightness4';
import LogoutIcon from '@material-ui/icons/ExitToApp';

import ApiHandlerContext from '../provider/ApiHandlerContext';

export default ({ user, anchorEl, handlePopoverClose }) => {
  const { authHandler } = React.useContext(ApiHandlerContext);

  return (
    <Popover
      id="mouse-over-popover"
      open={anchorEl}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      onClose={handlePopoverClose}
      disableRestoreFocus
    >

      <CardHeader
        avatar={
          <Avatar aria-label="recipe" src={user.getImageUrl()} />
                }
        title={user.getName()}
        subheader={user.getEmail()}
      />

      <MenuItem onClick={handlePopoverClose}>
        <ListItemIcon>
          <DarkModeIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Toggle Dark Mode" />
      </MenuItem>

      <MenuItem onClick={authHandler.signOutFromGoogle}>
        <ListItemIcon>
          <LogoutIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </MenuItem>

    </Popover>
  );
};
