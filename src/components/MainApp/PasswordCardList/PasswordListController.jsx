import React from 'react';

import ApiHandlerContext from '../provider/ApiHandlerContext';
import PasswordCardListUI from './PasswordCardListUI';

export default ({ selectedIndex }) => {
  const { database } = React.useContext(ApiHandlerContext);
  const [passwordList, setPasswordList] = React.useState([]);
  const [categoriesMappings, setCategoriesMappings] = React.useState({});
  const [filteredList, setFilteredList] = React.useState([]);

  React.useEffect(() => {
    database.subscribeForTableUpdates('data', (updatedList) => {
      setPasswordList(updatedList);
    });
    database.subscribeForTableUpdates('categories', (updatedCategories) => {
      const mappings = {};
      updatedCategories.forEach((category) => {
        mappings[category.name] = category;
      });
      setCategoriesMappings(mappings);
    });
  }, []);

  React.useEffect(() => {
    if (selectedIndex === -1) {
      setFilteredList(passwordList);
    } else {
      const targetCategory = Object.values(categoriesMappings)
        .filter((category) => category.row_idx === selectedIndex)[0].name;
      setFilteredList(passwordList.filter((password) => password.category === targetCategory));
    }
  }, [passwordList, selectedIndex, categoriesMappings]);
  return (
    <PasswordCardListUI
      passwordList={filteredList}
      categoriesMappings={categoriesMappings}
      database={database}
    />
  );
};
