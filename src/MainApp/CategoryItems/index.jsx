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

  // List of categories
  const [categories, setCategories] = React.useState([]);

  // all the accounts in the list
  const [accountList, setAccountList] = React.useState([]);
  // filtered account list based on category selected
  const [filteredList, setFilteredList] = React.useState([]);

  // When the component is mounted we subscribe for table updates
  // for both data table and categories table
  React.useEffect(() => {
    database.subscribeForTableUpdates('data', (updatedList) => {
      setAccountList(updatedList);
    });
    database.subscribeForTableUpdates('categories', (updatedCategories) => {
      setCategories(updatedCategories);
    });
  }, []);

  // Whenever tha selected category index or accountList is updated
  React.useEffect(() => {
    if (selectedCategoryIndex === -1) {
      setFilteredList(accountList);
    } else {
      const targetCategory = categories[selectedCategoryIndex].name;
      setFilteredList(accountList.filter((password) => password.category === targetCategory));
    }
  }, [selectedCategoryIndex, accountList]);

  // Method to delete the selected category
  const deleteCategory = async () => {
    await database.deleteCategory(selectedCategoryIndex, () => {
      // once we have removed the data from table before emitting updates
      // to app we set the selcted category index to -1 to go to all accounts
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
      deleteEnabled={selectedCategoryIndex > 1}
      deleteCategory={deleteCategory}
    />
  );
};
