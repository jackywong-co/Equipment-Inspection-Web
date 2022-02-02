import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import LogoutButton from './LogoutButton';
import AuthContext from '../services/auth.context';

function Header() {

    const authCtx = React.useContext(AuthContext);

    const isLoggedIn = authCtx.isLoggedIn;

    return (
        <Box >
            <AppBar position="static">
                <Toolbar>


                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>

                    </Typography>

                    {isLoggedIn && (
                        <LogoutButton />
                    )
                    }
                </Toolbar>
            </AppBar>
        </Box>

    );
}

export default Header;
