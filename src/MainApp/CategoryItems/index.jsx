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
export default ({ selectedCategoryIndex, setSelectedCategoryIndex }) => {
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
    if (selectedCategoryIndex === -1) {
      setFilteredList(accountList);
    } else {
      const targetCategory = categories[selectedCategoryIndex].name;
      setFilteredList(accountList.filter((password) => password.category === targetCategory));
    }
  }, [selectedCategoryIndex, accountList, categories]);

  const deleteCategory = async () => {
    await database.deleteCategory(selectedCategoryIndex, () => {
      setSelectedCategoryIndex(-1);
    });
    showToast('Category has been deleted');
  };
  return (
    <CategoryItemsDumb
      heading={selectedCategoryIndex === -1 ? 'All Accounts' : categories[selectedCategoryIndex].name}
      passwordList={filteredList}
      categoriesMappings={categoriesIndexedByName(categories)}
      database={database}
      deleteCategory={deleteCategory}
      deleteEnabled={selectedCategoryIndex > 1}
    />
  );
};
