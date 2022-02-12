import React, { useContext, useState } from 'react';
import { useNavigate } from "react-router-dom";

// mui
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { FormControl, RadioGroup, FormControlLabel, FormLabel, Radio, Autocomplete, MenuItem } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
// jwt
import jwt_decode from "jwt-decode";


const UserCreateForm = () => {
  const navigate = useNavigate();
  const [displayErrorMessage, setErrorDisplay] = React.useState(false);
  const [role, setRole] = React.useState('checker')
  const roles = [
    {
      value: 'checker',
      label: 'Checker',
    },
    {
      value: 'manager',
      label: 'Manager',
    },
  ];

  const validationSchema = yup.object({
    username: yup
      .string('Enter your username')
      .required('Username is required'),
    password: yup
      .string('Enter your password')
      .min(8, 'Password should be of minimum 8 characters length')
      .required('Password is required'),
  });
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      role: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log({
        username: values.username,
        password: values.password,
        role: values.role
      })
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
          Create User
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
            autoComplete="current-password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}

          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="role"
            label="Role"
            id="role"
            select
            value={role}
            onChange={(e, value) => {
              setRole(e.target.value);
              formik.setFieldValue('role', e.target.value)
            }}
          >
            {roles.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Submit
          </Button>

        </form>
      </Box>
    </Container>
  );
};

export default UserCreateForm;
