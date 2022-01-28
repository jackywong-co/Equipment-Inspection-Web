import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import LogoutButton from './LogoutButton';

function Header() {

    

    return (
        <Box >
            <AppBar position="static">
                <Toolbar>


                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>

                    </Typography>
                   <LogoutButton/>
                </Toolbar>
            </AppBar>
        </Box>

    );
}

export default Header;
