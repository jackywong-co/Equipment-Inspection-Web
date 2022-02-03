import AuthContext from "../../../services/auth.context";
import React, { useContext, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axiosInstance from '../../../services/axios.instance';
// mui
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import { useFormik } from 'formik';
import * as yup from 'yup';
// jwt
import jwt_decode from "jwt-decode";
const LoginForm = () => {
    const navigate = useNavigate();
    const [displayErrorMessage, setErrorDisplay] = React.useState(false);

    const authCtx = useContext(AuthContext);

    const validationSchema = yup.object({
        username: yup
            .string('Enter your username')
            .required('Username is required'),
        password: yup
            .string('Enter your password')
            .required('Password is required'),
    });
    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            axiosInstance
                .post('login/', {
                    username: values.username,
                    password: values.password
                })
                .then((result) => {
                    const decodedToken = jwt_decode(result.data.access)
                    const expirationTime = decodedToken.exp - decodedToken.iat

                    authCtx.login(result.data.access, expirationTime)
                    navigate('/');
                })
                .catch((error) => {
                    console.log("eorror")
                    console.log(error.response.status)
                    console.log(error.response.data)
                    if (error.response.status = 401) {
                        console.log("401 eorror")
                    }
                    setErrorDisplay(true)
                });
            console.log({
                username: values.username,
                password: values.password
            });
        },
    });
    return (
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
                <form onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        error={formik.touched.username && Boolean(formik.errors.username)}
                        helperText={formik.touched.username && formik.errors.username}
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
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                        autoComplete="current-password"
                    />
                    {displayErrorMessage && <Alert severity="error">Account not found</Alert>}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign In
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default LoginForm;
