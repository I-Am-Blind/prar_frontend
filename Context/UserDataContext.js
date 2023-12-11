
import React from 'react';

const UserDataContext = React.createContext({
  userdata: {},
  updateUserData: () => {}
});

export default UserDataContext;
