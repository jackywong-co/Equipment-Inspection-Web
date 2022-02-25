// icon
import { Icon } from '@iconify/react';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import plusFill from '@iconify/icons-eva/plus-fill';
import eyeOffFIll from '@iconify/icons-eva/eye-off-fill';
import eyeFIll from '@iconify/icons-eva/eye-fill';
import editFill from '@iconify/icons-eva/edit-fill';
// mui
import {
  Button, Card, Container, Stack, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Typography, IconButton, Menu, MenuItem, ListItemIcon, ListItemText,
  Dialog, TextField, Box, CssBaseline, Autocomplete
} from '@mui/material';
// react
import { useEffect, useState } from 'react';
// router
import Page from 'src/components/Page';
// api
import { getRooms, checkRoom, activeRoom, disableRoom, createRoom, updateRoom, deleteRoom } from 'src/services/room.context';
import { getUsers } from 'src/services/user.context';
import { getEquipments, checkEquipment, activeEquipment, disableEquipment, createEquipment, updateEquipment, deleteEquipment } from 'src/services/equipment.context';
import { getForms, checkForm, activeForm, disableForm, createForm, updateForm, deleteForm } from '../../services/form.context';
import Label from 'src/components/Label';
import EnhancedTableHead from 'src/components/EnchancedTableHead';
import { filter } from 'lodash';
import EnchancedToolbar from 'src/components/EnchancedToolbar';
import SearchNotFound from 'src/components/SearchNotFound';
// form
import { useFormik } from 'formik';
import * as yup from 'yup';
//
import jwt_decode from "jwt-decode";

export default function Form() {
  
  const [userList, setUserList] = useState([]);

  const loadUserList = async () => {
    await getUsers()
      .then((response) => {
        setUserList(response.data);
      });
  }

  const [equipmentList, setEquipmentList] = useState([]);

  const loadEquipmentList = async () => {
    await getEquipments()
      .then((response) => {
        setEquipmentList(response.data);
      });
  }

  const [formItems, setFormItems] = useState([]);

  const loadFormList = async () => {
    await getForms()
      .then((response) => {
        setFormItems(response.data);
      });
  }


  useEffect(() => {
    loadFormList();
  }, []);


  // table header
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('form_name');

  const TABLE_HEAD = [
    { id: 'form_name', label: 'Form Name', alignRight: false },
    { id: 'created_by', label: 'Created by', alignRight: false },
    { id: 'equipment', label: 'Equipment', alignRight: false },
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
      return filter(array, (form) => form.form_name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
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
  const filteredUsers = applySortFilter(formItems, getComparator(order, orderBy), filterName);
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
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - formItems.length) : 0;
  // more menu
  const [anchorEl, setAnchorEl] = useState(null);
  const handleElClick = (inputFormId, event) => {
    const obj = {
      inputFormId,
      element: event.currentTarget
    };
    loadUserList();
    loadEquipmentList();
    setAnchorEl(obj);
    checkCheckStatus(inputFormId)
  };
  const handleElClose = () => {
    setAnchorEl(null);
  };

  // check form is active
  const [formStatus, setFormStatus] = useState();
  const checkCheckStatus = (id) => {
    checkForm(id)
      .then((response) => {
        setFormStatus(response.data.is_active)
      })
  }
  // active form
  const handleActiveForm = async (id) => {
    await activeForm(id)
    await loadFormList()
    handleElClose();
  }

  // disable form
  const handleDisableForm = async (id) => {
    await disableForm(id)
    await loadFormList()
    handleElClose();
  };

  const [createFormInit, setCreateFormInit] = useState({
    created_by: {},
    question: [
      {
        "id": "56d24e82-fdb7-4f15-8baf-b721cbc8a854",
        "question_text": "Normal ?",
        "is_active": true
      },
      {
        "id": "040079f3-9049-4c78-a32b-7b45a7e6ee55",
        "question_text": "Defects ?",
        "is_active": true
      },
      {
        "id": "d5d60df8-22fa-496f-86b9-1c5e6c9e45dd",
        "question_text": "Follow up actions ?",
        "is_active": true
      }
    ],
  });
  // add form
  const [addOpen, setAddOpen] = useState(false);
  const handleAddClick = () => {
    loadUserList();
    loadEquipmentList();
    let user_id = jwt_decode(localStorage.getItem('token')).user_id
    let user
    for (let x in userList) {
      if (user_id === userList[x].id) {
        user = userList[x];
        console.log(user)
      }
    };
    setCreateFormInit({
      created_by: user,
    })
    setAddOpen(true);
  };
  const handleAddClose = () => {
    setAddOpen(false);
  };
  // add form form 
  const validationSchema = yup.object({
    form_name: yup
      .string('Enter Room Name')
      .required('Room Name is required'),

  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      form_name: '',
      created_by: createFormInit.created_by,
      equipment: [],
      question: createFormInit.question,
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm, setSubmitting, setErrors }) => {
      setSubmitting(false);
      let resetControl = true;
      for (let x in formItems) {
        let formNameList = formItems[x].form_name
        if (values.form_name === formNameList) {
          setErrors({ form_name: 'Form Name in used' });
          resetControl = false;
        }
      }
      if (resetControl) {
        const form_name = values.form_name;
        const created_by = values.created_by;
        let equipment = []
        equipment.push(values.equipment);
        const question = values.question;
        await createForm(form_name, created_by, equipment, question);
        await loadFormList();
        resetForm();
        handleAddClose();
      }
    },
  });

  // edit form
  const [editFormInit, setEditFormInit] = useState({
    id: '',
    form_name: '',
    created_by: {},
    equipment: {},
  });
  const [editOpen, setEditOpen] = useState(false);
  const handleEditClick = (id) => {
    let form_name
    let created_by
    let equipment
    for (let x in formItems) {
      if (id === formItems[x].form_id) {
        form_name = formItems[x].form_name;
        created_by = formItems[x].created_by;
        equipment = formItems[x].equipments[0];
      }
    }
    console.log(formItems)
    console.log({
      id: id,
      form_name: form_name,
      created_by: created_by,
      equipment: equipment,
    })
    setEditFormInit({
      id: id,
      form_name: form_name,
      created_by: created_by,
      equipment: equipment,
    });
    setEditOpen(true);
    handleElClose();
  }
  const handleEditClose = () => {
    setEditOpen(false);
  };
  const editValidationSchema = yup.object({
    form_name: yup
      .string('Enter Form Name')
      .required('Form name is required'),
  });

  // edit form form
  const editFormFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      form_name: editFormInit.form_name,
      created_by: editFormInit.created_by,
      equipment: editFormInit.equipment,
    },
    validationSchema: editValidationSchema,
    onSubmit: async (values, { resetForm, setSubmitting, setErrors }) => {
      setSubmitting(false);
      let resetControl = true;
      for (let x in formItems) {
        let roomNameList = formItems[x].form_name
        if (values.form_name === roomNameList) {
          if (values.form_name !== roomNameList) {
            setErrors({ form_name: 'Room Name in used' });
            resetControl = false;
          }
        }
      }
      if (resetControl) {
        const id = editFormInit.id;
        const form_name = values.form_name;
        const created_by = values.created_by;
        await updateForm(id, form_name, created_by);
        await loadFormList();
        resetForm();
        handleEditClose();
      }
    },
  });
  const handleDeleteRoom = async (id) => {
    await deleteForm(id);
    await loadFormList();
  }
  return (
    <Page title="Form">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Form
          </Typography>
          <Button
            variant="contained"
            onClick={handleAddClick}
            startIcon={<Icon icon={plusFill} />}
          >
            New Form
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
                rowCount={formItems.length}
                onRequestSort={handleRequestSort}
              />
              {/* table body */}
              <TableBody>
                {filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow
                      key={row.form_id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row" padding="normal" >
                        <Stack direction="row" alignItems="center" spacing={5}>
                          <Typography variant="subtitle2" noWrap >
                            {row.form_name}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="left">{row.created_by.username}</TableCell>
                      <TableCell align="left">{row.equipments[0]["equipment_name"]}</TableCell>
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
                          aria-expanded={anchorEl != null && anchorEl.inputFormId === row.form_id ? 'true' : undefined}
                          aria-haspopup="true"
                          onClick={(e) => handleElClick(row.form_id, e)}
                        >
                          <Icon icon={moreVerticalFill} width={20} height={20} />
                        </IconButton>
                        {/* more menu */}
                        <Menu
                          form_id={row.form_id}
                          anchorEl={anchorEl != null && anchorEl.element}
                          open={anchorEl != null && anchorEl.inputFormId === row.form_id}
                          onClose={handleElClose}
                          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                          transformOrigin={{ vertical: 'top', horizontal: 'right' }}

                        >
                          {formStatus
                            ?
                            <MenuItem sx={{ color: 'text.secondary' }} onClick={() => { handleDisableForm(row.form_id) }}>
                              <ListItemIcon>
                                <Icon icon={eyeOffFIll} width={24} height={24} />
                              </ListItemIcon>
                              <ListItemText primary="Disable" primaryTypographyProps={{ variant: 'body2' }} />
                            </MenuItem>
                            :
                            <MenuItem sx={{ color: 'text.secondary' }} onClick={() => { handleActiveForm(row.form_id) }}>
                              <ListItemIcon>
                                <Icon icon={eyeFIll} width={24} height={24} />
                              </ListItemIcon>
                              <ListItemText primary="Active" primaryTypographyProps={{ variant: 'body2' }} />
                            </MenuItem>
                          }
                          <MenuItem sx={{ color: 'text.secondary' }} onClick={() => { handleEditClick(row.form_id) }}>
                            <ListItemIcon>
                              <Icon icon={editFill} width={24} height={24} />
                            </ListItemIcon>
                            <ListItemText primary="Edit" primaryTypographyProps={{ variant: 'body2' }} />
                          </MenuItem>
                          <MenuItem sx={{ color: 'text.secondary' }} onClick={() => { handleDeleteRoom(row.form_id) }}>
                            <ListItemIcon>
                              <Icon icon={trash2Outline} width={24} height={24} />
                            </ListItemIcon>
                            <ListItemText primary="Delete" primaryTypographyProps={{ variant: 'body2' }} />
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
              count={formItems.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </Card>
        {/* add dialoag form */}
        <Dialog open={addOpen} onClose={handleAddClose}>

          {/* add form form */}
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
                Create Form
              </Typography>
              <form onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="form_name"
                  label="Form Name"
                  name="form_name"
                  autoComplete="form_name"
                  value={formik.values.form_name}
                  onChange={formik.handleChange}
                  error={formik.touched.form_name && Boolean(formik.errors.form_name)}
                  helperText={formik.touched.form_name && formik.errors.form_name}
                  autoFocus
                />
                <Autocomplete
                  id="created_by"
                  name="created_by"
                  required
                  value={formik.values.created_by}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  options={userList}
                  getOptionLabel={(option) => option.username}
                  onChange={(e, value) => {
                    formik.setFieldValue('created_by', value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      label="Created by"
                      margin="normal"
                      error={formik.touched.created_by && Boolean(formik.errors.created_by)}
                      helperText={formik.touched.created_by && formik.errors.created_by}
                    />
                  )}
                />

                <Autocomplete
                  id="equipment"
                  name="equipment"
                  options={equipmentList}
                  getOptionLabel={(option) => option.equipment_name}
                  onChange={(e, value) => {
                    formik.setFieldValue('equipment', value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      required
                      label="Equipment"
                      margin="normal"
                      error={formik.touched.equipment && Boolean(formik.errors.equipment)}
                      helperText={formik.touched.equipment && formik.errors.equipment}
                    />
                  )}
                />
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
              Edit Form
            </Typography>
            <form onSubmit={editFormFormik.handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="form_name"
                label="Form Name"
                name="form_name"
                autoComplete="form_name"
                value={editFormFormik.values.form_name}
                onChange={editFormFormik.handleChange}
                error={editFormFormik.touched.form_name && Boolean(editFormFormik.errors.form_name)}
                helperText={editFormFormik.touched.form_name && editFormFormik.errors.form_name}
              />
              <Autocomplete
                id="created_by"
                name="created_by"
                required
                fullWidth
                value={editFormFormik.values.created_by}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                options={userList}
                getOptionLabel={(option) => option.username}
                onChange={(e, value) => {
                  editFormFormik.setFieldValue('created_by', value);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    label="Created by"
                    margin="normal"
                    error={editFormFormik.touched.created_by && Boolean(editFormFormik.errors.created_by)}
                    helperText={editFormFormik.touched.created_by && editFormFormik.errors.created_by}
                  />
                )}
              />
              <Autocomplete
                id="equipment"
                name="equipment"
                required
                fullWidth
                value={editFormFormik.values.equipment}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                options={equipmentList}
                getOptionLabel={(option) => option.equipment_name}
                onChange={(e, value) => {
                  editFormFormik.setFieldValue('equipment', value);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    label="Created by"
                    margin="normal"
                    error={editFormFormik.touched.equipment && Boolean(editFormFormik.errors.equipment)}
                    helperText={editFormFormik.touched.equipment && editFormFormik.errors.equipment}
                  />
                )}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={editFormFormik.isSubmitting}
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