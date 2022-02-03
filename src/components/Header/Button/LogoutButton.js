import Button from '@mui/material/Button';
import React, { useContext } from 'react';
import Box from '@mui/material/Box';
import AuthContext from '../../../services/auth.context';

function LogoutButton() {
  const authCtx = useContext(AuthContext)
  const logoutHandler = () => {
    authCtx.logout();
  };
  return (
    <Box>
      <Button color="inherit" onClick={logoutHandler}>Logout</Button>
    </Box>
  );
}

export default LogoutButton;
