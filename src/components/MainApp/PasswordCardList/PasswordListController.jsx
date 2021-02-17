import React from 'react';

import ApiHandlerContext from '../provider/ApiHandlerContext';
import PasswordCardListUI from './PasswordCardListUI';

export default () => {
  const { database } = React.useContext(ApiHandlerContext);
  const [passwordList, setPasswordList] = React.useState([]);
  const [categoriesMappings, setCategoriesMappings] = React.useState({});

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

  return (
    <PasswordCardListUI
      passwordList={passwordList}
      categoriesMappings={categoriesMappings}
      database={database}
    />
  );
};
