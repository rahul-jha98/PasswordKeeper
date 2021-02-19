import React from 'react';

import ApiHandlerContext from '../provider/ApiHandlerContext';
import CategoryItemsDumb from './CateogoryItemsDumb';

const categoriesIndexedByName = (categories) => {
  const mappings = {};
  categories.forEach((category) => {
    mappings[category.name] = category;
  });
  return mappings;
};
export default ({ selectedIndex, setSelectedIndex }) => {
  const { database, showToast } = React.useContext(ApiHandlerContext);
  const [accountList, setAccountList] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  const [filteredList, setFilteredList] = React.useState([]);

  React.useEffect(() => {
    database.subscribeForTableUpdates('data', (updatedList) => {
      setAccountList(updatedList);
    });
    database.subscribeForTableUpdates('categories', (updatedCategories) => {
      setCategories(updatedCategories);
    });
  }, []);

  React.useEffect(() => {
    if (selectedIndex === -1) {
      setFilteredList(accountList);
    } else {
      const targetCategory = categories[selectedIndex].name;
      setFilteredList(accountList.filter((password) => password.category === targetCategory));
    }
  }, [selectedIndex, accountList, categories]);

  const deleteCategory = async () => {
    await database.deleteCategory(selectedIndex, () => {
      setSelectedIndex(-1);
    });
    showToast('Category has been deleted');
  };
  return (
    <CategoryItemsDumb
      heading={selectedIndex === -1 ? 'All Accounts' : categories[selectedIndex].name}
      passwordList={filteredList}
      categoriesMappings={categoriesIndexedByName(categories)}
      database={database}
      deleteCategory={deleteCategory}
      deleteEnabled={selectedIndex > 1}
    />
  );
};
