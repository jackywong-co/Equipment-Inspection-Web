// icon
import { Icon } from '@iconify/react';
import moreVerticalFill from '@iconify/icons-eva/more-vertical-fill';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import plusFill from '@iconify/icons-eva/plus-fill';
import editFill from '@iconify/icons-eva/edit-fill';
// mui
import {
  Button, Card, Container, Stack, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Typography, IconButton, Menu, MenuItem, ListItemIcon, ListItemText,
  Dialog, TextField, Box, CssBaseline
} from '@mui/material';
// react
import { useEffect, useState } from 'react';
// router
import Page from 'src/components/Page';
// api
import { getRooms, checkRoom, activeRoom, disableRoom, createRoom, updateRoom } from 'src/services/room.context';
import { getEquipments, checkEquipment, activeEquipment, disableEquipment } from 'src/services/equipment.context';
import Label from 'src/components/Label';
import EnhancedTableHead from 'src/components/EnchancedTableHead';
import { filter } from 'lodash';
import EnchancedToolbar from 'src/components/EnchancedToolbar';
import SearchNotFound from 'src/components/SearchNotFound';
// form
import { useFormik } from 'formik';
import * as yup from 'yup';

export default function Equipment() {

  const [equipmentList, setEquipmentList] = useState([]);

  const loadEquipmentList = async () => {
    await getEquipments()
      .then((response) => {
        console.log(response.data);
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
    { id: 'equipment_name', label: 'Room Name', alignRight: false },
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
    setAddOpen(true);
  };
  const handleAddClose = () => {
    setAddOpen(false);
  };

  // add equipment form 
  const validationSchema = yup.object({
    equipment_name: yup
      .string('Enter Equipment Name')
      .required('Equipment Name is required'),
    equipment_code: yup
      .string('Enter Equipment Code')
      .required('Equipment Code is required'),
    room: yup
      .string('Enter Room')
      .required('Room is required'),
  });

  const formik = useFormik({
    initialValues: {
      equipment_name: '',
      equipment_code: '',
      room: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm, setSubmitting, setErrors }) => {
      setSubmitting(false);
      let resetControl = true;
      for (let x in equipmentList) {
        console.log(equipmentList[x].equipment_name)
        let roomNameList = equipmentList[x].equipment_name
        if (values.equipment_name === roomNameList) {
          setErrors({ equipment_name: 'Room Name in used' });
          resetControl = false;
        }
      }
      if (resetControl) {
        const equipment_name = values.equipment_name;
        const equipment_code = values.equipment_code;
        await createRoom(equipment_name, equipment_code);
        await loadEquipmentList();
        resetForm();
        handleEditClose();
      }
    },
  });

  // edit room
  const [editRoom, setEditRoom] = useState({
    id: '',
    equipment_name: '',
    equipment_code: ''
  });
  const [editOpen, setEditOpen] = useState(false);
  const handleEditClick = (id) => {
    for (let x in equipmentList) {
      if (id === equipmentList[x].id) {
        let equipment_name = equipmentList[x].equipment_name;
        let equipment_code = equipmentList[x].equipment_code;
        setEditRoom({
          id: id,
          equipment_name: equipment_name,
          equipment_code: equipment_code
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
      .string('Enter Room Name')
      .required('Room name is required'),
    equipment_code: yup
      .string('Enter Equipment_code')
      .required('Equipment_code is required'),
  });

  // edit room form
  const editUserFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      equipment_name: editRoom.equipment_name,
      equipment_code: editRoom.equipment_code,
    },
    validationSchema: editValidationSchema,
    onSubmit: async (values, { resetForm, setSubmitting, setErrors }) => {
      setSubmitting(false);
      let resetControl = true;
      for (let x in equipmentList) {
        let roomNameList = equipmentList[x].equipment_name
        if (values.equipment_name === roomNameList) {
          if (values.equipment_name !== roomNameList) {
            setErrors({ equipment_name: 'Room Name in used' });
            resetControl = false;
          }
        }
      }
      if (resetControl) {
        const id = editRoom.id;
        const equipment_name = values.equipment_name;
        const equipment_code = values.equipment_code;
        await updateRoom(id, equipment_name, equipment_code);
        await loadEquipmentList();
        resetForm();
        handleEditClose();
      }
    },
  });

  return (
    <Page title="Room">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Room
          </Typography>
          <Button
            variant="contained"
            onClick={handleAddClick}
            startIcon={<Icon icon={plusFill} />}
          >
            New Room
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
                      key={row.id}
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
                      <TableCell align="left">{row.room.room_name}</TableCell>
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
                          {equipmentStatus
                            ?
                            <MenuItem sx={{ color: 'text.secondary' }} onClick={() => { handleDisableEquipment(row.id) }}>
                              <ListItemIcon>
                                <Icon icon={trash2Outline} width={24} height={24} />
                              </ListItemIcon>
                              <ListItemText primary="Disable" primaryTypographyProps={{ variant: 'body2' }} />
                            </MenuItem>
                            :
                            <MenuItem sx={{ color: 'text.secondary' }} onClick={() => { handleActiveEquipment(row.id) }}>
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
                Create Room
              </Typography>
              <form onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="equipment_name"
                  label="Room Name"
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
                  required
                  fullWidth
                  name="equipment_code"
                  label="Equipment_code"
                  type="equipment_code"
                  id="equipment_code"
                  autoComplete="current-equipment_code"
                  value={formik.values.equipment_code}
                  onChange={formik.handleChange}
                  error={formik.touched.equipment_code && Boolean(formik.errors.equipment_code)}
                  helperText={formik.touched.equipment_code && formik.errors.equipment_code}
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
                label="Room Name"
                name="equipment_name"
                autoComplete="equipment_name"
                value={editUserFormik.values.equipment_name}
                onChange={editUserFormik.handleChange}
                error={editUserFormik.touched.equipment_name && Boolean(editUserFormik.errors.equipment_name)}
                helperText={editUserFormik.touched.equipment_name && editUserFormik.errors.equipment_name}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="equipment_code"
                label="Equipment_code"
                type="equipment_code"
                id="equipment_code"
                autoComplete="current-equipment_code"
                value={editUserFormik.values.equipment_code}
                onChange={editUserFormik.handleChange}
                error={editUserFormik.touched.equipment_code && Boolean(editUserFormik.errors.equipment_code)}
                helperText={editUserFormik.touched.equipment_code && editUserFormik.errors.equipment_code}
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