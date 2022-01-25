
import * as React from 'react';
import { useNavigate } from "react-router-dom";
import axiosInstance from '../components/axios';

// mui
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';




const theme = createTheme();

function Login() {
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
         // axios
         axiosInstance.post('login/',{
            username: data.get('username'),
            password: data.get('password')
         }).then((result) => {
             localStorage.setItem('access_token', result.data.access);
             localStorage.setItem('refresh_token', result.data.refresh);
             axiosInstance.defaults.headers['Aythorization'] = 'JWT' + localStorage.getItem('access_token');
             navigate('/');
             console.log({
                result
              });
        });
        
        console.log({
            username: data.get('username'),
            password: data.get('password')
          });
    }

    return (
        <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign In
                    </Button>
                </Box>
            </Box>
        </Container>
    </ThemeProvider>
    );
}

export default Login;
