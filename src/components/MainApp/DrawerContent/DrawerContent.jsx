import React from 'react';

import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SvgIcon from '@material-ui/core/SvgIcon';

import CategoriesList from './CategoriesList';
import ApiHandlerContext from '../provider/ApiHandlerContext';

export default ({ marginClassName }) => {
  const { database } = React.useContext(ApiHandlerContext);
  const [categories, setCategories] = React.useState([]);

  React.useEffect(() => {
    database.subscribeForTableUpdates('categories', (updatedList) => {
      setCategories(updatedList);
    });
  }, []);

  return (
    <div>
      <div className={marginClassName} />
      <Divider />
      <List>
        <ListItem button key="all">
          <ListItemIcon>
            <SvgIcon>
              <image
                alt="icon"
                xlinkHref={`${process.env.PUBLIC_URL}/assets/all-list-icon.svg`}
              />
            </SvgIcon>
          </ListItemIcon>
          <ListItemText primary="All Accounts" />
        </ListItem>

      </List>
      <Divider />
      <CategoriesList categories={categories} />
    </div>
  );
};
