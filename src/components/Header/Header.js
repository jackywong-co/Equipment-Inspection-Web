import * as React from 'react';
import { Link } from "react-router-dom";

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import LoginButton from './Button/LoginButton';
import LogoutButton from './Button/LogoutButton';

import AuthContext from '../../services/auth.context';

function Header() {
  const authCtx = React.useContext(AuthContext);
  const isLoggedIn = authCtx.isLoggedIn;
  return (
    <Box >
      <AppBar position="static">
        <Toolbar>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link to="/">
              News
            </Link>
          </Typography>

          {isLoggedIn && (
            <LogoutButton />
          )}
          {!isLoggedIn && (
            <LoginButton />
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Header;
