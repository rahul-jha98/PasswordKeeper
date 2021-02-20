import React from 'react';

import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import LoadMaterialIcon from '../LoadMaterialIcon';

export default ({
  categories,
  selectedCategoryIndex,
  handleListItemClick,
}) => (
  <List>
    {categories.map((category, idx) => (
      <ListItem
        button
        key={category.name}
        selected={selectedCategoryIndex === idx}
        onClick={(event) => handleListItemClick(event, idx)}
      >
        <ListItemIcon>
          <LoadMaterialIcon name={category.icon} />
        </ListItemIcon>
        <ListItemText primary={category.name} />
      </ListItem>
    ))}
  </List>
);
