import React from 'react';

import Divider from '@material-ui/core/Divider';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MailIcon from '@material-ui/icons/Mail';
import Icon from '@material-ui/core/Icon';

export default ({ marginClassName }) => (
  <div>
    <div className={marginClassName} />
    <Divider />
    <List>
      <ListItem button key="all">
        <ListItemIcon>
          <Icon>
            <img src="https://fonts.gstatic.com/s/i/materialiconstwotone/list/v11/24px.svg" alt="logo" />
          </Icon>
        </ListItemIcon>
        <ListItemText primary="All Accounts" />
      </ListItem>

    </List>
    <Divider />
    <List>
      {['All mail', 'Trash', 'Spam'].map((text, index) => (
        <ListItem button key={text}>
          <ListItemIcon>
            {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
          </ListItemIcon>
          <ListItemText primary={text} />
        </ListItem>
      ))}
    </List>
  </div>
);
