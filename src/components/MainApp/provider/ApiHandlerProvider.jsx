import React from 'react';
import ApiHandlerContext from './ApiHandlerContext';

const ApiHandlerProvider = (props) => {
  const {
    authHandler, showToast, database,
  } = props;

  return (
    <ApiHandlerContext.Provider
      value={{
        authHandler,
        showToast,
        database,
      }}
    >

      {props.children}

    </ApiHandlerContext.Provider>
  );
};

export default ApiHandlerProvider;
