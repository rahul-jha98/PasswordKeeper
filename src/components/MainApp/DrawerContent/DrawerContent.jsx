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
  marginClassName, selectedIndex, setSelectedIndex, handleDrawerToggle,
}) => {
  const { database } = React.useContext(ApiHandlerContext);
  const [categories, setCategories] = React.useState([]);

  React.useEffect(() => {
    database.subscribeForTableUpdates('categories', (updatedList) => {
      setCategories(updatedList);
    });
  }, []);

  const handleListItemClick = (event, index) => {
    if (index !== selectedIndex) {
      setSelectedIndex(index);
    }
    handleDrawerToggle();
  };

  return (
    <div>
      <div className={marginClassName} />
      <Divider />
      <List>
        <ListItem
          button
          key="all"
          selected={selectedIndex === -1}
          onClick={(event) => handleListItemClick(event, -1)}
        >
          <ListItemIcon>
            <ListIcon />
          </ListItemIcon>
          <ListItemText primary="All Accounts" />
        </ListItem>

      </List>
      <Divider />
      <CategoriesList {...{ categories, selectedIndex, handleListItemClick }} />
      <AddCategoryButton closeDrawer={handleDrawerToggle} />
    </div>
  );
};
