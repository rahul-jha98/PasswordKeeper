import React from 'react';

import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListIcon from '@material-ui/icons/List';

import CategoriesList from './CategoriesList';
import AddCategoryButton from './AddCategoryButton';
import ApiHandlerContext from '../provider/ApiHandlerContext';

export default ({
  selectedCategoryIndex, setSelectedCategoryIndex, handleDrawerToggle, marginClassName,
}) => {
  const { database } = React.useContext(ApiHandlerContext);
  const [categories, setCategories] = React.useState([]);

  React.useEffect(() => {
    // Subscribe for categories table once when component loads
    database.subscribeForTableUpdates('categories', (updatedList) => {
      setCategories(updatedList);
    });
  }, []);

  const handleListItemClick = (event, index) => {
    if (index !== selectedCategoryIndex) {
      setSelectedCategoryIndex(index);
    }
    handleDrawerToggle();
  };

  return (
    <div>
      {/** Margin of the size app bar to make top item visible when drawer is under app bar */}
      <div className={marginClassName} />
      <Divider />
      <List>
        <ListItem
          button
          key="all"
          selected={selectedCategoryIndex === -1}
          onClick={(event) => handleListItemClick(event, -1)}
        >
          <ListItemIcon>
            <ListIcon />
          </ListItemIcon>
          <ListItemText primary="All Accounts" />
        </ListItem>

      </List>
      <Divider />
      {/** Menu Item List of all the categories */}
      <CategoriesList {...{ categories, selectedCategoryIndex, handleListItemClick }} />
      {/** Button to add cateogyr */}
      <AddCategoryButton closeDrawer={handleDrawerToggle} />
    </div>
  );
};
