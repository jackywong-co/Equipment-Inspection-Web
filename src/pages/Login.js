
import * as React from 'react';
import { useNavigate } from "react-router-dom";
import axiosInstance from '../services/axios.instance';

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




function Login() {
    const navigate = useNavigate();
    const [displayErrorMessage, setErrorDisplay] = React.useState(false);

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
                    localStorage.setItem('access_token', result.data.access);
                    localStorage.setItem('refresh_token', result.data.refresh);
                    navigate('/');
                    console.log({
                        result
                    });
                })           
                .catch((error) => {
                    console.log("eorror")
                    console.log(error.response.status)
                    console.log(error.response.data)
                    if (error.response.status = 401) {
                        console.log("401 eorror")
                        setErrorDisplay(true)
                    }
                });

            console.log({
                username: values.username,
                password: values.password
            });




        },
    });


    return (

       

    );
}

export default Login;
