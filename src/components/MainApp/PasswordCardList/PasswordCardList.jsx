import React from 'react';

import ApiHandlerContext from '../provider/ApiHandlerContext';

export default () => {
  const { database } = React.useContext(ApiHandlerContext);
  const [passwordList, setPasswordList] = React.useState([]);

  React.useEffect(() => {
    database.subscribeForTableUpdates('data', (updatedList) => {
      setPasswordList(updatedList);
      // console.log(updatedList);
    });
  }, []);

  return (
    passwordList.map((data) => <h1>{ data.name }</h1>)
  );
};
