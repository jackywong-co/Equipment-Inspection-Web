import Button from '@mui/material/Button';
import React from 'react';
import Box from '@mui/material/Box';
import { useNavigate } from "react-router-dom";

function LoginButton() {
  const navigate = useNavigate()
  const loginHandler = () => {
    navigate('login');
  };
  return (
    <Box>
      <Button color="inherit" onClick={loginHandler}>login</Button>
    </Box>
  );
}

export default LoginButton;
