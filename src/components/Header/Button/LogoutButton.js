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
    <Button fullWidth color="inherit" variant="outlined" onClick={logoutHandler}>Logout</Button>
  );
}

export default LogoutButton;
