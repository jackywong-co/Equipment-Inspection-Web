// icon
import { Icon } from '@iconify/react';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import plusFill from '@iconify/icons-eva/plus-fill';
import editFill from '@iconify/icons-eva/edit-fill';
import eyeOffFIll from '@iconify/icons-eva/eye-off-fill';
import eyeFIll from '@iconify/icons-eva/eye-fill';
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
import { getRooms } from 'src/services/room.context';
import { getEquipments, checkEquipment, activeEquipment, disableEquipment, createEquipment, updateEquipment, deleteEquipment } from 'src/services/equipment.context';
import Label from 'src/components/Label';
import EnhancedTableHead from 'src/components/EnchancedTableHead';
import { filter } from 'lodash';
import EnchancedToolbar from 'src/components/EnchancedToolbar';
import SearchNotFound from 'src/components/SearchNotFound';
// form
import { useFormik } from 'formik';
import * as yup from 'yup';

export default function Equipment() {

  const [roomList, setRoomList] = useState([]);

  const loadRoomList = async () => {
    await getRooms()
      .then((response) => {
        setRoomList(response.data);
      });
  }

  const [equipmentList, setEquipmentList] = useState([]);

  const loadEquipmentList = async () => {
    await getEquipments()
      .then((response) => {
        setEquipmentList(response.data);
      });
  }

  useEffect(() => {

    loadEquipmentList();
  }, []);


  // table header
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('equipment_name');

  const TABLE_HEAD = [
    { id: 'equipment_name', label: 'Equipment Name', alignRight: false },
    { id: 'equipment_code', label: 'Equipment Code', alignRight: false },
    { id: 'room', label: 'Room', alignRight: false },
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
      return filter(array, (equipment) => equipment.equipment_name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
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
  const filteredUsers = applySortFilter(equipmentList, getComparator(order, orderBy), filterName);
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
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - equipmentList.length) : 0;
  // more menu
  const [anchorEl, setAnchorEl] = useState(null);
  const handleElClick = (inputFormId, event) => {
    const obj = {
      inputFormId,
      element: event.currentTarget
    };
    loadRoomList();
    setAnchorEl(obj);
    checkCheckStatus(inputFormId)
  };
  const handleElClose = () => {
    setAnchorEl(null);
  };

  // check equipment is active
  const [equipmentStatus, setEquipmentStatus] = useState();
  const checkCheckStatus = (id) => {
    checkEquipment(id)
      .then((response) => {
        setEquipmentStatus(response.data.is_active)
      })
  }
  // active equipment
  const handleActiveEquipment = async (id) => {
    await activeEquipment(id)
    await loadEquipmentList()
    handleElClose();
  }

  // disable equipment
  const handleDisableEquipment = async (id) => {
    await disableEquipment(id)
    await loadEquipmentList()
    handleElClose();
  };

  // add equipment
  const [addOpen, setAddOpen] = useState(false);
  const handleAddClick = () => {
    loadRoomList();
    setAddOpen(true);
  };
  const handleAddClose = () => {
    setAddOpen(false);
  };
  // create equipment form 
  const validationSchema = yup.object({
    equipment_name: yup
      .string('Enter Equipment Name')
      .required('Equipment Name is required'),
    equipment_code: yup
      .string('Enter Equipment Code'),
    room_id: yup
      .string('Enter Room')
      .required('Room is required'),
  });

  const formik = useFormik({
    initialValues: {
      equipment_name: '',
      equipment_code: '',
      room_id: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm, setSubmitting, setErrors, setFieldValue }) => {
      setSubmitting(false);
      let resetControl = true;
      for (let x in equipmentList) {
        // console.log(equipmentList[x].equipment_name)
        let equipmentNameList = equipmentList[x].equipment_name
        if (values.equipment_name === equipmentNameList) {
          setErrors({ equipment_name: 'Equipment Name in used' });
          resetControl = false;
        }
        let equipmentCodeList = equipmentList[x].equipment_code
        if (values.equipment_code === equipmentCodeList && values.equipment_code !== '') {
          setErrors({ equipment_code: 'Equipment Code in used' });
          resetControl = false;
        }
      }
      if (resetControl) {
        const equipment_name = values.equipment_name;
        const equipment_code = values.equipment_code;
        const room_id = values.room_id;
        await createEquipment(equipment_name, equipment_code, room_id);
        await loadEquipmentList();
        resetForm();
        handleAddClose();
      }
    },
  });

  // edit equipment
  const [editEquipment, setEditEquipment] = useState({
    id: '',
    equipment_name: '',
    equipment_code: '',
    room: {}
  });
  const [editOpen, setEditOpen] = useState(false);
  const handleEditClick = (id) => {
    for (let x in equipmentList) {
      if (id === equipmentList[x].equipment_id) {
        let equipment_name = equipmentList[x].equipment_name;
        let equipment_code = equipmentList[x].equipment_code;
        let room
        for (let y in roomList) {
          if (equipmentList[x].room_id === roomList[y].id) {
            room = roomList[y];
          }
        }
        setEditEquipment({
          id: id,
          equipment_name: equipment_name,
          equipment_code: equipment_code,
          room: room
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
    equipment_name: yup
      .string('Enter Equipment Name')
      .required('Equipment Name is required'),
    equipment_code: yup
      .string('Enter Equipment Code'),
  });
  const handleDeleteEquipment = async (id) => {
    await deleteEquipment(id);
    await loadEquipmentList();
  }
  // edit equipment form
  const editUserFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      equipment_name: editEquipment.equipment_name,
      equipment_code: editEquipment.equipment_code,
      room: editEquipment.room
    },
    validationSchema: editValidationSchema,
    onSubmit: async (values, { resetForm, setSubmitting, setErrors }) => {
      setSubmitting(false);
      let resetControl = true;
      for (let x in equipmentList) {
        let equipmentNameList = equipmentList[x].equipment_name
        if (values.equipment_name === equipmentNameList && values.equipment_name !== values.equipment_name) {
          setErrors({ equipment_name: 'Equipment Name in used' });
          resetControl = false;
        }
        let equipmentCodeList = equipmentList[x].equipment_code
        if (values.equipment_code === equipmentCodeList && values.equipment_code !== values.equipment_code) {
          setErrors({ equipment_code: 'Equipment Code in used' });
          resetControl = false;
        }
      }
      if (resetControl) {
        const id = editEquipment.id;
        const equipment_name = values.equipment_name;
        const equipment_code = values.equipment_code;
        const room_id = values.room.id;
        await updateEquipment(id, equipment_name, equipment_code, room_id);
        await loadEquipmentList();
        resetForm();
        handleEditClose();
      }
    },
  });

  return (
    <Page title="Equipment">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Equipment
          </Typography>
          <Button
            variant="contained"
            onClick={handleAddClick}
            startIcon={<Icon icon={plusFill} />}
          >
            New Equipment
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
                rowCount={equipmentList.length}
                onRequestSort={handleRequestSort}
              />
              {/* table body */}
              <TableBody>
                {filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow
                      key={row.equipment_id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row" padding="normal" >
                        <Stack direction="row" alignItems="center" spacing={5}>
                          <Typography variant="subtitle2" noWrap >
                            {row.equipment_name}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="left">{row.equipment_code}</TableCell>
                      <TableCell align="left">{row.room_name}</TableCell>
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
                          aria-expanded={anchorEl != null && anchorEl.inputFormId === row.equipment_id ? 'true' : undefined}
                          aria-haspopup="true"
                          onClick={(e) => handleElClick(row.equipment_id, e)}
                        >
                          <Icon icon={moreVerticalFill} width={20} height={20} />
                        </IconButton>
                        {/* more menu */}
                        <Menu
                          id={row.equipment_id}
                          anchorEl={anchorEl != null && anchorEl.element}
                          open={anchorEl != null && anchorEl.inputFormId === row.equipment_id}
                          onClose={handleElClose}
                          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                          transformOrigin={{ vertical: 'top', horizontal: 'right' }}

                        >
                          {equipmentStatus
                            ?
                            <MenuItem sx={{ color: 'text.secondary' }} onClick={() => { handleDisableEquipment(row.equipment_id) }}>
                              <ListItemIcon>
                                <Icon icon={eyeOffFIll} width={24} height={24} />
                              </ListItemIcon>
                              <ListItemText primary="Disable" primaryTypographyProps={{ variant: 'body2' }} />
                            </MenuItem>
                            :
                            <MenuItem sx={{ color: 'text.secondary' }} onClick={() => { handleActiveEquipment(row.equipment_id) }}>
                              <ListItemIcon>
                                <Icon icon={eyeFIll} width={24} height={24} />
                              </ListItemIcon>
                              <ListItemText primary="Active" primaryTypographyProps={{ variant: 'body2' }} />
                            </MenuItem>
                          }
                          <MenuItem sx={{ color: 'text.secondary' }} onClick={() => { handleEditClick(row.equipment_id) }}>
                            <ListItemIcon>
                              <Icon icon={editFill} width={24} height={24} />
                            </ListItemIcon>
                            <ListItemText primary="Edit" primaryTypographyProps={{ variant: 'body2' }} />
                          </MenuItem>
                          <MenuItem sx={{ color: 'text.secondary' }} onClick={() => { handleDeleteEquipment(row.equipment_id) }}>
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
              count={equipmentList.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </Card>
        {/* add dialoag form */}
        <Dialog open={addOpen} onClose={handleAddClose}>

          {/* add room form */}
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
                Create Equipment
              </Typography>
              <form onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="equipment_name"
                  label="Equipment Name"
                  name="equipment_name"
                  autoComplete="equipment_name"
                  value={formik.values.equipment_name}
                  onChange={formik.handleChange}
                  error={formik.touched.equipment_name && Boolean(formik.errors.equipment_name)}
                  helperText={formik.touched.equipment_name && formik.errors.equipment_name}
                  autoFocus
                />
                <TextField
                  margin="normal"
                  fullWidth
                  name="equipment_code"
                  label="Equipment Code"
                  type="equipment_code"
                  id="equipment_code"
                  autoComplete="current-equipment_code"
                  value={formik.values.equipment_code}
                  onChange={formik.handleChange}
                  error={formik.touched.equipment_code && Boolean(formik.errors.equipment_code)}
                  helperText={formik.touched.equipment_code && formik.errors.equipment_code}
                />
                <Autocomplete
                  id="room_id"
                  name="room_id"
                  required
                  options={roomList}
                  getOptionLabel={(option) => option.room_name}
                  onChange={(e, value) => {
                    formik.setFieldValue('room_id', value.id);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      label="Room"
                      margin="normal"
                      error={formik.touched.room_id && Boolean(formik.errors.room_id)}
                      helperText={formik.touched.room_id && formik.errors.room_id}
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
            <form onSubmit={editUserFormik.handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="equipment_name"
                label="Equipment Name"
                name="equipment_name"
                autoComplete="equipment_name"
                value={editUserFormik.values.equipment_name}
                onChange={editUserFormik.handleChange}
                error={editUserFormik.touched.equipment_name && Boolean(editUserFormik.errors.equipment_name)}
                helperText={editUserFormik.touched.equipment_name && editUserFormik.errors.equipment_name}
              />
              <TextField
                margin="normal"
                fullWidth
                name="equipment_code"
                label="Equipment Code"
                type="equipment_code"
                id="equipment_code"
                autoComplete="current-equipment_code"
                value={editUserFormik.values.equipment_code}
                onChange={editUserFormik.handleChange}
                error={editUserFormik.touched.equipment_code && Boolean(editUserFormik.errors.equipment_code)}
                helperText={editUserFormik.touched.equipment_code && editUserFormik.errors.equipment_code}
              />
              <Autocomplete
                id="room"
                name="room"
                required
                value={editUserFormik.values.room}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                options={roomList}
                getOptionLabel={(option) => option.room_name}
                onChange={(e, value) => {
                  editUserFormik.setFieldValue('room', value);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    label="Room"
                    margin="normal"
                    error={editUserFormik.touched.room && Boolean(editUserFormik.errors.room)}
                    helperText={editUserFormik.touched.room && editUserFormik.errors.room}
                  />
                )}
              />
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