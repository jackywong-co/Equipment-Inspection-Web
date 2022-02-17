// icon
import { Icon } from '@iconify/react';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import plusFill from '@iconify/icons-eva/plus-fill';
import editFill from '@iconify/icons-eva/edit-fill';
// mui
import {
  Button, Card, Container, Stack, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Typography, IconButton, Menu, MenuItem, ListItemIcon, ListItemText, Avatar,
  Dialog, TextField, Box, CssBaseline
} from '@mui/material';
// react
import { useEffect, useState } from 'react';
// router
import Page from '../components/Page';
// api
import { getUsers, activeUser, disableUser, checkUser, createUser, updateUser } from '../services/user.context';
import Label from '../components/Label';
import EnhancedTableHead from '../components/EnchancedTableHead';
import { filter } from 'lodash';
import EnchancedToolbar from '../components/EnchancedToolbar';
import SearchNotFound from '../components/SearchNotFound';
// form
import { useFormik } from 'formik';
import * as yup from 'yup';

export default function User() {

  // api
  const [userItems, setUserItems] = useState([]);
  const loadUserList = async () => {
    await getUsers()
      .then((response) => {
        setUserItems(response.data);
      });
  }
  useEffect(() => {
    loadUserList();
  }, []);


  // table header
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('username');

  const TABLE_HEAD = [
    { id: 'username', label: 'User', alignRight: false },
    { id: 'is_staff', label: 'Role', alignRight: false },
    { id: 'is_active', label: 'Status', alignRight: false },
    { id: '' }
  ];

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function applySortFilter(array, comparator, query) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    if (query) {
      return filter(array, (user) => user.username.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
  }
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  // toolbar
  const [filterName, setFilterName] = useState('');
  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };
  const filteredUsers = applySortFilter(userItems, getComparator(order, orderBy), filterName);
  const isUserNotFound = filteredUsers.length === 0;

  // TablePagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userItems.length) : 0;
  // more menu
  const [anchorEl, setAnchorEl] = useState(null);
  const handleElClick = (inputFormId, event) => {
    const obj = {
      inputFormId,
      element: event.currentTarget
    };
    setAnchorEl(obj);
    checkUserStatus(inputFormId)
  };
  const handleElClose = () => {
    setAnchorEl(null);
  };
  // check user is staff
  const [userStatus, setUserStatus] = useState();
  const checkUserStatus = (id) => {
    checkUser(id)
      .then((response) => {
        setUserStatus(response.data.is_active)
      })
  }
  // active user
  const handleActiveUesr = async (id) => {
    await activeUser(id)
    await loadUserList()
    handleElClose();
  }

  // disable user
  const handleDisableUser = async (id) => {
    await disableUser(id)
    await loadUserList()
    handleElClose();
  };

  // add user
  const [addOpen, setAddOpen] = useState(false);
  const handleAddClick = () => {
    setAddOpen(true);
  };
  const handleAddClose = () => {
    setAddOpen(false);
  };

  // add user form 
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
      role: 'checker',
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm, setSubmitting, setErrors }) => {
      setSubmitting(false);
      let resetControl = true;
      for (let x in userItems) {
        console.log(userItems[x].username)
        let usernameList = userItems[x].username
        if (values.username === usernameList) {
          setErrors({ username: 'username in used' });
          resetControl = false;
        }
      }
      if (resetControl) {
        const username = values.username;
        const password = values.password;
        const role = values.role === 'checker' ? 'false' : 'true';
        await createUser(username, password, role);
        await loadUserList();
        resetForm();
      }
    },
  });

  // edit user
  const [editUser, setEditUser] = useState({
    id: '',
    username: '',
    role: ''
  });
  const [editOpen, setEditOpen] = useState(false);
  const handleEditClick = (id) => {
    for (let x in userItems) {
      if (id === userItems[x].id) {
        let username = userItems[x].username;
        let role = userItems[x].is_staff ? 'manager' : 'checker';
        setEditUser({
          id: id,
          username: username,
          role: role
        });
      }
    }
    setEditOpen(true);
    handleElClose();
  }
  const handleEditClose = () => {
    setEditOpen(false);
  };
  const editValidationSchema = yup.object({
    username: yup
      .string('Enter your username')
      .required('Username is required'),
  });
  // edit user form
  const editUserFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      username: editUser.username,
      role: editUser.role,
    },
    validationSchema: editValidationSchema,
    onSubmit: async (values, { resetForm, setSubmitting, setErrors }) => {
      setSubmitting(false);
      let resetControl = true;
      for (let x in userItems) {
        let usernameList = userItems[x].username
        if (values.username === usernameList) {
          if (values.username !== usernameList) {
            setErrors({ username: 'username in used' });
            resetControl = false;
          }
        }
      }
      if (resetControl) {
        const id = editUser.id;
        const username = values.username;
        const role = values.role === 'checker' ? 'false' : 'true';
        await updateUser(id, username, role);
        await loadUserList();
        resetForm();
        handleEditClose();
      }
    },
  });

  return (
    <Page title="User">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            User
          </Typography>
          <Button
            variant="contained"
            onClick={handleAddClick}
            startIcon={<Icon icon={plusFill} />}
          >
            New User
          </Button>
        </Stack>

        {/* main */}
        <Card>
          {/* Toolbar */}
          <EnchancedToolbar
            filterName={filterName}
            onFilterName={handleFilterByName}
          />
          {/* table */}
          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              {/* table head */}
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={userItems.length}
                onRequestSort={handleRequestSort}
              />
              {/* table body */}
              <TableBody>
                {filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row" padding="normal" >
                        <Stack direction="row" alignItems="center" spacing={5}>
                          <Avatar alt={row.username} src='/static/user.png' />
                          <Typography variant="subtitle2" noWrap >
                            {row.username}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="left">{row.is_staff ? 'Menager' : 'Checker'}</TableCell>
                      <TableCell align="left">
                        <Label
                          variant="ghost"
                          color={row.is_active ? 'success' : 'error'}
                        >
                          {row.is_active ? 'Active' : 'Disabled'}
                        </Label>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          aria-label='more'
                          aria-controls="long-menu"
                          aria-expanded={anchorEl != null && anchorEl.inputFormId === row.id ? 'true' : undefined}
                          aria-haspopup="true"
                          onClick={(e) => handleElClick(row.id, e)}
                        >
                          <Icon icon={moreVerticalFill} width={20} height={20} />
                        </IconButton>
                        {/* more menu */}
                        <Menu
                          id={row.id}
                          anchorEl={anchorEl != null && anchorEl.element}
                          open={anchorEl != null && anchorEl.inputFormId === row.id}
                          onClose={handleElClose}
                          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                          transformOrigin={{ vertical: 'top', horizontal: 'right' }}

                        >
                          {userStatus
                            ?
                            <MenuItem sx={{ color: 'text.secondary' }} onClick={() => { handleDisableUser(row.id) }}>
                              <ListItemIcon>
                                <Icon icon={trash2Outline} width={24} height={24} />
                              </ListItemIcon>
                              <ListItemText primary="Disable" primaryTypographyProps={{ variant: 'body2' }} />
                            </MenuItem>
                            :
                            <MenuItem sx={{ color: 'text.secondary' }} onClick={() => { handleActiveUesr(row.id) }}>
                              <ListItemIcon>
                                <Icon icon={trash2Outline} width={24} height={24} />
                              </ListItemIcon>
                              <ListItemText primary="Active" primaryTypographyProps={{ variant: 'body2' }} />
                            </MenuItem>
                          }
                          <MenuItem sx={{ color: 'text.secondary' }} onClick={() => { handleEditClick(row.id) }}>
                            <ListItemIcon>
                              <Icon icon={editFill} width={24} height={24} />
                            </ListItemIcon>
                            <ListItemText primary="Edit" primaryTypographyProps={{ variant: 'body2' }} />
                          </MenuItem>
                        </Menu>
                      </TableCell>
                    </TableRow>
                  ))}
                {/* TablePagination */}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
              {isUserNotFound && (
                <TableBody>
                  <TableRow>
                    <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                      <SearchNotFound searchQuery={filterName} />
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
            {/* TablePagination */}
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={userItems.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </Card>
        {/* add dialoag form */}
        <Dialog open={addOpen} onClose={handleAddClose}>

          {/* add user form */}
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
                  value={formik.values.role}
                  onChange={formik.handleChange}
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
                  disabled={formik.isSubmitting}
                >
                  Submit
                </Button>
              </form>
            </Box>
          </Container>
        </Dialog>
      </Container>

      <Dialog open={editOpen} onClose={handleEditClose}>

        {/* edit user form */}
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
              Edit User
            </Typography>
            <form onSubmit={editUserFormik.handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                value={editUserFormik.values.username}
                onChange={editUserFormik.handleChange}
                error={editUserFormik.touched.username && Boolean(editUserFormik.errors.username)}
                helperText={editUserFormik.touched.username && editUserFormik.errors.username}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="role"
                label="Role"
                id="role"
                select
                value={editUserFormik.values.role}
                onChange={editUserFormik.handleChange}
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
                disabled={editUserFormik.isSubmitting}
              >
                Submit
              </Button>
            </form>
          </Box>
        </Container>
      </Dialog>
    </Page>
  );
}