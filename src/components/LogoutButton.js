import Button from '@mui/material/Button';
import React from 'react';
import Box from '@mui/material/Box';

import { useNavigate } from "react-router-dom";

function LogoutButton() {
    const [displayLogoutButton, setDisplayLogoutButton] = React.useState(false)
    const navigate = useNavigate();

    const logoutHandler = () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        setDisplayLogoutButton(false)
        navigate('/login');
    }

    React.useEffect(() => {
        // console.log(window.location.pathname);
        if (window.location.pathname !== '/login') {
            setDisplayLogoutButton(true)
        }
    }, []);

    return (
        <Box>
            {displayLogoutButton && <Button color="inherit" onClick={logoutHandler}>Logout</Button>}
        </Box>
    );
}

export default LogoutButton;
