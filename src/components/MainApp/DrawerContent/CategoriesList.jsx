import React from 'react';

import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import MaterialIcon from '../MaterialIcon';

export default ({
  categories,
}) => (
  <List>
    {categories.map((category) => (
      <ListItem button key={category.name}>
        <ListItemIcon>
          {/* <img
            alt="icon"
            src={`${process.env.PUBLIC_URL}/assets/${category.icon}.svg`}
          /> */}
          <MaterialIcon name={category.icon} />
        </ListItemIcon>
        <ListItemText primary={category.name} />
      </ListItem>
    ))}
  </List>
);
