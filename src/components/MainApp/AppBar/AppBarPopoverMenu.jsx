/* eslint-disable import/no-anonymous-default-export */
import React from 'react';

import Popover from '@material-ui/core/Popover';
import CardHeader from '@material-ui/core/CardHeader';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';

import GitHubIcon from '@material-ui/icons/GitHub';
import InfoIcon from '@material-ui/icons/InfoOutlined';
import LogoutIcon from '@material-ui/icons/ExitToApp';

import ApiHandlerContext from '../provider/ApiHandlerContext';

export default ({
  user, anchorEl, handlePopoverClose, mobileToggleClass,
}) => {
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

      <a
        href="https://github.com/rahul-jha98/DrivePasswordManager"
        rel="noopener noreferrer"
        target="_blank"
        style={{ color: 'inherit', textDecoration: 'none' }}
      >
        <MenuItem onClick={handlePopoverClose} className={mobileToggleClass}>
          <ListItemIcon>
            <GitHubIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Github Repo" />
        </MenuItem>
      </a>
      <MenuItem onClick={handlePopoverClose}>
        <ListItemIcon>
          <InfoIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="About" />
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
